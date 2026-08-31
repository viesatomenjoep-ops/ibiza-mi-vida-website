# AI visibility report

Generated 2026-08-31 by `scripts/ai-visibility/report.mjs` from `scripts/ai-visibility/results.csv`.
**Do not edit the tables by hand** — regenerate with `npm run ai-report`. The
measurement discipline at the foot of this file is prose and is safe to edit.

## No measurements yet

`results.csv` contains only its header, so there is nothing to report. There are **20 active queries** waiting to be run — see the method below.

The first week of data is not a baseline. Three or four weeks are, because
single-session mention rates swing far too much to read anything into one run.

## How to measure this properly

The numbers above are only worth anything if the runs are disciplined. Five
rules, in order of how often they get broken.

### 1. Clean sessions, every time

Run every query in a **logged-out incognito window**, one query per window.
Personalisation and conversation memory both change the answer: an engine that
watched you open our site yesterday is far more likely to name us today, and
that tells you nothing about a stranger's result. Never run two queries in the
same chat thread — the second answer is contaminated by the first.

### 2. Ask the question exactly as written

Use the text in `prompts.json` verbatim. Rewording a query changes the result
more than a month of SEO work does, and if the prompt drifts you can no longer
tell which one moved. Retire a query by setting `active: false` rather than
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

`cited_url` is the most actionable column. Being named without a link is worth
far less than being linked, and knowing *which* page got cited tells you where to
put the next piece of work. Log a competitor every time one is named — that list
becomes the outreach target list in `docs/authority-plan.md`.

## The CSV format

`scripts/ai-visibility/results.csv`, one row per query per engine per run:

| Column | Meaning |
| --- | --- |
| `date` | ISO date, `YYYY-MM-DD` |
| `engine` | `chatgpt`, `perplexity`, `gemini` or `ai-overviews` |
| `query_id` | the `id` from `prompts.json` |
| `query` | the query text, copied for readability |
| `mentioned` | `1` if Ibiza Mi Vida was named at all, else `0` |
| `cited_url` | the URL of ours that was linked, blank if none |
| `competitors_mentioned` | other brands named, separated by `;` |
| `notes` | anything odd — quote it if it contains a comma |

Example row:

```
2026-09-02,perplexity,boat-nolicence-en,boat hire Ibiza without a licence,1,https://www.ibizamivida.com/en/boat-hire-ibiza-no-licence,clickandboat.com;samboat.com,cited third of five sources
```

Then run `npm run ai-report`.
