#!/usr/bin/env node
/**
 * Turns the hand-kept results.csv into a weekly AI-visibility report.
 *
 * There is no API that answers "does ChatGPT mention us for this query" — the
 * answer differs per session, per account and per day, and no vendor exposes it.
 * So the measurement is manual by necessity: a human runs the fixed queries in
 * clean logged-out sessions and records what happened. This script does the
 * part a human should not: the arithmetic, and the aggregation to a weekly
 * trend so nobody reads a single bad day as a signal.
 *
 * Zero dependencies. Reads scripts/ai-visibility/results.csv, writes
 * docs/ai-visibility-report.md.
 *
 * Usage: npm run ai-report
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const CSV = join(here, 'results.csv')
const OUT = join(here, '..', '..', 'docs', 'ai-visibility-report.md')
const PROMPTS = join(here, 'prompts.json')

/**
 * Minimal RFC 4180 CSV parser.
 *
 * Hand-rolled rather than split(',') because the `notes` and
 * `competitors_mentioned` columns will contain commas the moment somebody
 * writes a real note, and a naive split silently shifts every later column.
 */
function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let quoted = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ }
        else quoted = false
      } else field += ch
    } else if (ch === '"') {
      quoted = true
    } else if (ch === ',') {
      row.push(field); field = ''
    } else if (ch === '\n') {
      row.push(field); field = ''
      if (row.some((c) => c.trim() !== '')) rows.push(row)
      row = []
    } else if (ch !== '\r') {
      field += ch
    }
  }
  row.push(field)
  if (row.some((c) => c.trim() !== '')) rows.push(row)

  const [header, ...body] = rows
  if (!header) return []
  return body.map((cells) =>
    Object.fromEntries(header.map((h, i) => [h.trim(), (cells[i] ?? '').trim()])),
  )
}

/**
 * ISO week key (e.g. 2026-W35), used as the aggregation bucket.
 *
 * Weeks rather than days on purpose: mention rates for a single query swing
 * wildly between sessions, and a daily chart is mostly noise. The trend only
 * becomes readable at a week's worth of samples.
 */
function isoWeek(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return 'unknown'
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  // Thursday of the current week decides the year, per ISO 8601.
  const day = (target.getUTCDay() + 6) % 7
  target.setUTCDate(target.getUTCDate() - day + 3)
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4))
  const firstDay = (firstThursday.getUTCDay() + 6) % 7
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDay + 3)
  const week = 1 + Math.round((target - firstThursday) / (7 * 24 * 3600 * 1000))
  return `${target.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

const pct = (n, d) => (d === 0 ? '—' : `${Math.round((n / d) * 100)}%`)

/** A tiny inline bar, so the trend is readable in plain markdown. */
function bar(rate) {
  if (rate === null) return ''
  const filled = Math.round(rate * 20)
  return '█'.repeat(filled) + '░'.repeat(20 - filled)
}

function main() {
  const rows = parseCsv(readFileSync(CSV, 'utf8'))
  const prompts = JSON.parse(readFileSync(PROMPTS, 'utf8'))
  const activeQueries = prompts.queries.filter((q) => q.active !== false)

  const lines = []
  const now = new Date().toISOString().slice(0, 10)

  lines.push('# AI visibility report')
  lines.push('')
  lines.push(`Generated ${now} by \`scripts/ai-visibility/report.mjs\` from \`scripts/ai-visibility/results.csv\`.`)
  lines.push('**Do not edit the tables by hand** — regenerate with `npm run ai-report`. The')
  lines.push('measurement discipline at the foot of this file is prose and is safe to edit.')
  lines.push('')

  if (rows.length === 0) {
    lines.push('## No measurements yet')
    lines.push('')
    lines.push(`\`results.csv\` contains only its header, so there is nothing to report. There are **${activeQueries.length} active queries** waiting to be run — see the method below.`)
    lines.push('')
    lines.push('The first week of data is not a baseline. Three or four weeks are, because')
    lines.push('single-session mention rates swing far too much to read anything into one run.')
    lines.push('')
  } else {
    const engines = [...new Set(rows.map((r) => r.engine))].filter(Boolean).sort()
    const weeks = [...new Set(rows.map((r) => isoWeek(r.date)))].sort()
    const isMention = (r) => r.mentioned === '1' || r.mentioned.toLowerCase() === 'true'

    // ── Headline ────────────────────────────────────────────────────────────
    const mentions = rows.filter(isMention).length
    lines.push('## Headline')
    lines.push('')
    lines.push(`| Metric | Value |`)
    lines.push(`| --- | --- |`)
    lines.push(`| Observations | ${rows.length} |`)
    lines.push(`| Mention rate, all time | ${pct(mentions, rows.length)} |`)
    lines.push(`| Weeks covered | ${weeks.length} |`)
    lines.push(`| Engines tracked | ${engines.join(', ') || '—'} |`)
    lines.push('')

    // ── Mention rate per engine per week ────────────────────────────────────
    lines.push('## Mention rate per engine per week')
    lines.push('')
    lines.push(`| Week | ${engines.join(' | ')} | All |`)
    lines.push(`| --- | ${engines.map(() => '---').join(' | ')} | --- |`)
    for (const week of weeks) {
      const inWeek = rows.filter((r) => isoWeek(r.date) === week)
      const cells = engines.map((e) => {
        const subset = inWeek.filter((r) => r.engine === e)
        return subset.length ? `${pct(subset.filter(isMention).length, subset.length)} (${subset.length})` : '—'
      })
      lines.push(`| ${week} | ${cells.join(' | ')} | ${pct(inWeek.filter(isMention).length, inWeek.length)} |`)
    }
    lines.push('')
    lines.push('Sample size in brackets. A percentage from fewer than about 10 observations is')
    lines.push('not yet a number — treat it as an anecdote.')
    lines.push('')

    // ── Trend ───────────────────────────────────────────────────────────────
    lines.push('## Trend, all engines')
    lines.push('')
    lines.push('```')
    for (const week of weeks) {
      const inWeek = rows.filter((r) => isoWeek(r.date) === week)
      const rate = inWeek.length ? inWeek.filter(isMention).length / inWeek.length : null
      lines.push(`${week}  ${bar(rate)}  ${pct(inWeek.filter(isMention).length, inWeek.length).padStart(4)}  n=${inWeek.length}`)
    }
    lines.push('```')
    lines.push('')

    // ── Per query ───────────────────────────────────────────────────────────
    lines.push('## Per query, all time')
    lines.push('')
    lines.push('| Query | Runs | Mention rate | Last cited URL |')
    lines.push('| --- | --- | --- | --- |')
    const byQuery = new Map()
    for (const r of rows) {
      const key = r.query_id || r.query
      if (!byQuery.has(key)) byQuery.set(key, [])
      byQuery.get(key).push(r)
    }
    for (const [key, subset] of [...byQuery.entries()].sort()) {
      const lastCited = [...subset].reverse().find((r) => r.cited_url)?.cited_url || '—'
      lines.push(`| \`${key}\` | ${subset.length} | ${pct(subset.filter(isMention).length, subset.length)} | ${lastCited} |`)
    }
    lines.push('')

    const untested = activeQueries.filter((q) => !byQuery.has(q.id))
    if (untested.length) {
      lines.push(`**Never tested (${untested.length}):** ${untested.map((q) => `\`${q.id}\``).join(', ')}`)
      lines.push('')
    }

    // ── Competitors ─────────────────────────────────────────────────────────
    lines.push('## Competitors named most often')
    lines.push('')
    const counts = new Map()
    for (const r of rows) {
      for (const name of (r.competitors_mentioned || '').split(/[;|]/).map((s) => s.trim()).filter(Boolean)) {
        counts.set(name, (counts.get(name) || 0) + 1)
      }
    }
    if (counts.size === 0) {
      lines.push('_No competitors recorded yet._')
    } else {
      lines.push('| Competitor | Times named | Share of observations |')
      lines.push('| --- | --- | --- |')
      for (const [name, n] of [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)) {
        lines.push(`| ${name} | ${n} | ${pct(n, rows.length)} |`)
      }
      lines.push('')
      lines.push('These are the pages the engines currently prefer. Each one is a concrete')
      lines.push('outreach or content target — read them and ask what they answer that we do not.')
    }
    lines.push('')
  }

  lines.push(METHOD)
  writeFileSync(OUT, lines.join('\n'))
  console.log(`Wrote ${OUT} (${rows.length} observations, ${activeQueries.length} active queries).`)
}

/**
 * The method section, appended to every generated report.
 *
 * It is in the output rather than in a separate file because the number at the
 * top of this report is meaningless without it, and a reader who sees "40%" with
 * no context will either panic or celebrate — both wrong.
 */
const METHOD = `## How to measure this properly

The numbers above are only worth anything if the runs are disciplined. Five
rules, in order of how often they get broken.

### 1. Clean sessions, every time

Run every query in a **logged-out incognito window**, one query per window.
Personalisation and conversation memory both change the answer: an engine that
watched you open our site yesterday is far more likely to name us today, and
that tells you nothing about a stranger's result. Never run two queries in the
same chat thread — the second answer is contaminated by the first.

### 2. Ask the question exactly as written

Use the text in \`prompts.json\` verbatim. Rewording a query changes the result
more than a month of SEO work does, and if the prompt drifts you can no longer
tell which one moved. Retire a query by setting \`active: false\` rather than
editing it, so old rows stay interpretable.

### 3. Every other day is enough

Daily is fine, every other day is plenty, weekly is too sparse to separate
signal from noise. Around 20 queries across four engines is roughly 80
observations per run, which is a comfortable half hour.

### 4. Read the trend, never the snapshot

**Mention rates fluctuate between about 20% and 80% for the same query and the
same site, with nothing changed.** Model updates, index refreshes and retrieval
randomness all move it. A single bad day means nothing. Three consecutive weeks
of decline means something. If you take one thing from this file: never make a
decision on one run.

### 5. Record the citation, not just the mention

\`cited_url\` is the most actionable column. Being named without a link is worth
far less than being linked, and knowing *which* page got cited tells you where to
put the next piece of work. Log a competitor every time one is named — that list
becomes the outreach target list in \`docs/authority-plan.md\`.

## The CSV format

\`scripts/ai-visibility/results.csv\`, one row per query per engine per run:

| Column | Meaning |
| --- | --- |
| \`date\` | ISO date, \`YYYY-MM-DD\` |
| \`engine\` | \`chatgpt\`, \`perplexity\`, \`gemini\` or \`ai-overviews\` |
| \`query_id\` | the \`id\` from \`prompts.json\` |
| \`query\` | the query text, copied for readability |
| \`mentioned\` | \`1\` if Ibiza Mi Vida was named at all, else \`0\` |
| \`cited_url\` | the URL of ours that was linked, blank if none |
| \`competitors_mentioned\` | other brands named, separated by \`;\` |
| \`notes\` | anything odd — quote it if it contains a comma |

Example row:

\`\`\`
2026-09-02,perplexity,boat-nolicence-en,boat hire Ibiza without a licence,1,https://www.ibizamivida.com/en/boat-hire-ibiza-no-licence,clickandboat.com;samboat.com,cited third of five sources
\`\`\`

Then run \`npm run ai-report\`.
`

main()
