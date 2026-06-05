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

export function getNextRuns(expr: string, format: CronFormat, count = 8): Date[] {
  if (expr.trim().split(/\s+/).length !== format) return []
  try {
    const iter = CronExpressionParser.parse(normalizeExpr(expr, format), { currentDate: new Date() })
    const results: Date[] = []
    for (let i = 0; i < count; i++) {
      try { results.push(iter.next().toDate()) } catch { break }
    }
    return results
  } catch {
    return []
  }
}

export function describeField(fieldId: string, value: string, locale: Locale): string {
  return LOCALES[locale].describeField(fieldId, value)
}
