#!/usr/bin/env node
/**
 * Runs the whole SEO check suite and fails if any part fails.
 *
 * Order matters: ssr first, because if pages are not server-rendered then every
 * later check is reading an empty document and would report a cascade of
 * misleading failures rather than the one real cause.
 *
 * Every sub-check runs even when an earlier one fails. A suite that stops at
 * the first failure turns a fix-and-rerun cycle into one round trip per
 * problem, which is how check suites end up disabled.
 *
 * Usage: npm run check:seo   [CHECK_BASE_URL=… CHECK_ROUTES=…]
 */

import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { BASE, get, c } from './seo-check/lib.mjs'

const here = dirname(fileURLToPath(import.meta.url))

const CHECKS = [
  ['ssr', 'ssr-check.mjs'],
  ['schema', 'schema-check.mjs'],
  ['hreflang', 'hreflang-check.mjs'],
  ['onpage', 'onpage-check.mjs'],
]

function run(script) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [join(here, script)], { stdio: 'inherit', env: process.env })
    child.on('close', (code) => resolve(code ?? 1))
  })
}

/**
 * The three files that must simply exist and be served.
 *
 * They are checked here rather than in their own script because the failure
 * mode is trivial (a 404) and the fix is unrelated to page markup: a robots or
 * sitemap route that stops resolving takes the whole site out of discovery,
 * and nothing else in this suite would notice.
 */
async function checkFiles() {
  const files = [
    { path: '/robots.txt', must: ['Sitemap:', 'User-Agent'] },
    { path: '/llms.txt', must: ['Ibiza Mi Vida'] },
    { path: '/sitemap.xml', must: ['<urlset', '<loc>'] },
  ]
  let failed = 0
  for (const f of files) {
    const { status, html } = await get(`${BASE}${f.path}`)
    if (status !== 200) {
      console.log(`${c.fail('FAIL')} ${f.path} returned HTTP ${status}`)
      failed++
      continue
    }
    const missing = f.must.filter((token) => !html.toLowerCase().includes(token.toLowerCase()))
    if (missing.length) {
      console.log(`${c.fail('FAIL')} ${f.path} is served but does not contain: ${missing.join(', ')}`)
      failed++
      continue
    }
    console.log(`${c.pass('PASS')} ${f.path} (${html.length} bytes)`)
  }
  return failed === 0 ? 0 : 1
}

async function main() {
  console.log(c.dim(`SEO check suite against ${BASE}\n`))

  const results = []
  for (const [name, script] of CHECKS) {
    console.log(c.dim(`── ${name} ───────────────────────────────`))
    results.push([name, await run(script)])
    console.log('')
  }

  console.log(c.dim('── files ─────────────────────────────────'))
  results.push(['files', await checkFiles()])

  const failed = results.filter(([, code]) => code !== 0)
  console.log('')
  for (const [name, code] of results) {
    console.log(`${code === 0 ? c.pass('PASS') : c.fail('FAIL')}  ${name}`)
  }

  if (failed.length) {
    console.log(c.fail(`\ncheck:seo FAILED — ${failed.map(([n]) => n).join(', ')}`))
    return 1
  }
  console.log(c.pass('\ncheck:seo PASSED'))
  return 0
}

main()
  .then((code) => { process.exitCode = code })
  .catch((e) => {
    console.error(c.fail(`check:seo could not run: ${e.message}`))
    process.exitCode = 1
  })
