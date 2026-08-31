#!/usr/bin/env node
/**
 * Parses every JSON-LD block on every route and validates the required fields
 * per type.
 *
 * The failure this catches is quiet by design: invalid structured data does not
 * break a page, it just stops earning rich results, and Search Console reports
 * it weeks later against a URL sample. A JSON.parse over the rendered HTML
 * catches the whole class — trailing commas, an unescaped quote in a FAQ
 * answer, a React expression that stringified to "[object Object]" — at the
 * moment it is introduced.
 *
 * Beyond parsing, the assertions encode the two rules this site keeps breaking:
 *   • an Offer must carry a real price (never 0, never "TODO", never null)
 *   • an AggregateRating must carry a real reviewCount > 0
 * Both exist because invented prices and invented ratings have shipped here
 * before. See src/lib/google-reviews.ts and src/lib/rental-prices.ts.
 *
 * Usage:
 *   npm run check:schema
 *   CHECK_ROUTES=boat-rental-ibiza npm run check:schema
 */

import { Report, get, jsonLdBlocks, onBase, mapLimit, routesToCheck, c, stripTags, decode } from './seo-check/lib.mjs'

const report = new Report('schema')

/** Required top-level fields per @type. Types not listed are parsed but not asserted. */
const REQUIRED = {
  Organization: ['name', 'url'],
  Product: ['name', 'url'],
  FAQPage: ['mainEntity'],
  BreadcrumbList: ['itemListElement'],
  WebSite: ['url'],
  TravelAgency: ['name'],
  Person: ['name'],
  Service: ['name'],
  Event: ['name', 'startDate'],
}

/** Walks a graph/array/object and yields every node that has an @type. */
function* nodes(value) {
  if (Array.isArray(value)) {
    for (const v of value) yield* nodes(v)
    return
  }
  if (!value || typeof value !== 'object') return
  if (value['@graph']) yield* nodes(value['@graph'])
  if (value['@type']) yield value
  for (const [k, v] of Object.entries(value)) {
    if (k === '@graph') continue
    if (v && typeof v === 'object') yield* nodes(v)
  }
}

function validateNode(node, where) {
  const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']]

  for (const type of types) {
    const required = REQUIRED[type]
    if (required) {
      for (const field of required) {
        if (node[field] === undefined || node[field] === null || node[field] === '') {
          report.fail(where, `${type} is missing required field "${field}".`)
        }
      }
    }

    if (type === 'FAQPage') {
      const entities = Array.isArray(node.mainEntity) ? node.mainEntity : []
      if (!entities.length) report.fail(where, 'FAQPage has an empty mainEntity.')
      entities.forEach((q, i) => {
        if (!q.name) report.fail(where, `FAQPage question ${i + 1} has no name.`)
        const answer = q.acceptedAnswer?.text
        if (!answer) report.fail(where, `FAQPage question ${i + 1} ("${q.name}") has no acceptedAnswer.text.`)
      })
    }

    if (type === 'BreadcrumbList') {
      const items = Array.isArray(node.itemListElement) ? node.itemListElement : []
      if (items.length < 2) report.fail(where, 'BreadcrumbList needs at least two crumbs.')
      items.forEach((it, i) => {
        if (!it.name) report.fail(where, `Breadcrumb ${i + 1} has no name.`)
        if (it.position !== i + 1) report.fail(where, `Breadcrumb ${i + 1} has position ${it.position}.`)
      })
      // The last crumb is the current page and must not link to itself.
      const last = items[items.length - 1]
      if (last && last.item) {
        report.fail(where, 'The last BreadcrumbList item carries an "item" URL; it must be position-only.')
      }
    }

    if (type === 'Offer' || node.offers) {
      const offers = type === 'Offer' ? [node] : (Array.isArray(node.offers) ? node.offers : [node.offers])
      for (const o of offers.filter(Boolean)) {
        const price = Number(o.price)
        if (o.price === undefined || o.price === null || o.price === '') {
          report.fail(where, 'Offer has no price. Emit no Offer at all rather than an empty one.')
        } else if (!Number.isFinite(price) || price <= 0) {
          report.fail(where, `Offer price "${o.price}" is not a real amount. A placeholder price must never be published.`)
        }
        if (!o.priceCurrency) report.fail(where, 'Offer has no priceCurrency.')
      }
    }

    const rating = node.aggregateRating
    if (rating) {
      const value = Number(rating.ratingValue)
      const count = Number(rating.reviewCount ?? rating.ratingCount)
      if (!Number.isFinite(value) || value <= 0 || value > 5) {
        report.fail(where, `AggregateRating ratingValue "${rating.ratingValue}" is not a valid 0–5 rating.`)
      }
      if (!Number.isFinite(count) || count <= 0) {
        report.fail(where, `AggregateRating reviewCount "${rating.reviewCount}" must be a real count above zero.`)
      }
    }
  }
}

/**
 * The FAQ answers in schema must actually appear on the page.
 *
 * This is the single-source-of-truth rule made enforceable: markup claiming an
 * answer the visitor cannot see is a structured-data violation, and it is the
 * exact drift that happens when someone edits the accordion copy and forgets
 * the schema array. Compares on a normalised prefix so punctuation and
 * entity-encoding differences do not produce noise.
 */
function faqAnswersVisible(node, html, where) {
  const entities = Array.isArray(node.mainEntity) ? node.mainEntity : []
  const visible = decode(stripTags(html)).toLowerCase().replace(/\s+/g, ' ')
  for (const q of entities) {
    const question = (q.name || '').toLowerCase().replace(/\s+/g, ' ').slice(0, 60)
    if (question && !visible.includes(question)) {
      report.fail(where, `FAQ question is in the schema but not visible on the page: "${q.name}"`)
    }
    const answer = (q.acceptedAnswer?.text || '').toLowerCase().replace(/\s+/g, ' ').slice(0, 60)
    if (answer && !visible.includes(answer)) {
      report.fail(where, `FAQ answer is in the schema but not visible on the page (question: "${q.name}").`)
    }
  }
}

async function main() {
  const routes = await routesToCheck()
  if (!routes.length) {
    console.log(c.warn('schema: no routes matched — nothing to check.'))
    return 0
  }

  await mapLimit(routes, 8, async (r) => {
    const url = onBase(r.absolute)
    const { status, html } = await get(url)
    const where = `${r.locale ?? '?'} ${r.pathname}`
    report.checked++

    if (status !== 200) {
      report.fail(where, `HTTP ${status} — could not read structured data.`)
      return
    }

    const blocks = jsonLdBlocks(html)
    if (!blocks.length) {
      report.fail(where, 'No JSON-LD on the page at all.')
      return
    }

    for (const [i, raw] of blocks.entries()) {
      let parsed
      try {
        parsed = JSON.parse(raw)
      } catch (e) {
        report.fail(where, `JSON-LD block ${i + 1} is not valid JSON: ${e.message}`)
        continue
      }
      for (const node of nodes(parsed)) {
        validateNode(node, where)
        const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']]
        if (types.includes('FAQPage')) faqAnswersVisible(node, html, where)
      }
    }
  })

  return report.finish()
}

main()
  .then((code) => { process.exitCode = code })
  .catch((e) => {
    console.error(c.fail(`schema check could not run: ${e.message}`))
    process.exitCode = 1
  })
