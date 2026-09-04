import { describe, it, expect } from 'vitest'
import { stripHtml } from '@/lib/html-utils'

// Smoke test: also proves the vitest setup itself — the `@/` alias resolves,
// TypeScript compiles, the node environment runs. Real coverage lands in
// Phase 3/4 (clubtickets-live, merge-event-dates).
describe('stripHtml', () => {
  it('removes tags and collapses whitespace', () => {
    expect(stripHtml('<b>hi</b>')).toBe('hi')
    expect(stripHtml('<p>a</p><p>b</p>')).toBe('a b')
  })

  it('returns "" for empty / undefined input', () => {
    expect(stripHtml('')).toBe('')
    expect(stripHtml(undefined)).toBe('')
  })
})
