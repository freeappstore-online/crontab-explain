import { toString as cronToString } from 'cronstrue/dist/cronstrue-i18n.js'
import { CronExpressionParser } from 'cron-parser'
import type { Locale } from './i18n'
import { LOCALES } from './i18n'

export type CronFormat = 5 | 6 | 7

export function getDefaultExpr(format: CronFormat): string {
  if (format === 5) return '* * * * *'
  if (format === 6) return '0 * * * * *'
  return '0 * * * * * *'
}

export function exprToValues(expr: string, format: CronFormat): string[] {
  const parts = expr.trim().split(/\s+/)
  return parts.length === format ? parts : getDefaultExpr(format).split(' ')
}

export function valuesToExpr(values: string[]): string {
  return values.join(' ')
}

/** Strip year field from 7-field expressions before passing to cronstrue/cron-parser. */
function normalizeExpr(expr: string, format: CronFormat): string {
  if (format !== 7) return expr
  const parts = expr.trim().split(/\s+/)
  return parts.slice(0, 6).join(' ')
}

export interface ParseResult {
  valid: boolean
  description: string
  error: string | null
}

export function parseCron(expr: string, format: CronFormat, locale: Locale): ParseResult {
  const t = LOCALES[locale]
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== format) {
    return { valid: false, description: '', error: t.errorPrefix(format, parts.length) }
  }
  try {
    const description = cronToString(normalizeExpr(expr, format), {
      use24HourTimeFormat: true,
      verbose: false,
      dayOfWeekStartIndexZero: true,
      locale,
    })
    return { valid: true, description, error: null }
  } catch (e: unknown) {
    return { valid: false, description: '', error: e instanceof Error ? e.message : String(e) }
  }
}

/** Parts of a cron year field (`*`, `?`, lists, ranges, steps) as [from, to, step]. */
function yearRanges(field: string): [number, number, number][] {
  return field.split(',').map(part => {
    const [range, stepStr] = part.split('/')
    const step = stepStr ? Number(stepStr) : 1
    if (range === '*' || range === '?') return [1970, Infinity, step]
    const [lo, hi] = range.split('-').map(Number)
    return [lo, hi ?? (stepStr ? Infinity : lo), step]
  })
}

export function getNextRuns(expr: string, format: CronFormat, count = 8): Date[] {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== format) return []
  const years = yearRanges(format === 7 ? parts[6] : '*')
  const yearOk = (y: number) => years.some(([lo, hi, step]) => y >= lo && y <= hi && (y - lo) % step === 0)
  const minYear = Math.min(...years.map(r => r[0]))
  const maxYear = Math.max(...years.map(r => r[1]))
  try {
    // Runs are listed in UTC (CronResults), so compute them in UTC too.
    const start = Math.max(Date.now(), Date.UTC(minYear, 0, 1) - 1000)
    const iter = CronExpressionParser.parse(normalizeExpr(expr, format), { currentDate: new Date(start), tz: 'UTC' })
    const results: Date[] = []
    // Bounded scan so a sparse year field can't hang the page.
    for (let i = 0; i < 10_000 && results.length < count; i++) {
      let d: Date
      try { d = iter.next().toDate() } catch { break }
      const y = d.getUTCFullYear()
      if (y > maxYear) break
      if (yearOk(y)) results.push(d)
    }
    return results
  } catch {
    return []
  }
}

export function describeField(fieldId: string, value: string, locale: Locale): string {
  return LOCALES[locale].describeField(fieldId, value)
}
