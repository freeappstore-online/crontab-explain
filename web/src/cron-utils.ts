import { toString as cronToString } from 'cronstrue/dist/cronstrue-i18n.js'
import { CronExpressionParser } from 'cron-parser'
import type { Locale, FieldDef } from './i18n'
import { LOCALES } from './i18n'

export type CronFormat = 5 | 6 | 7

export function getFields(format: CronFormat, locale: Locale): FieldDef[] {
  const t = LOCALES[locale]
  if (format === 5) return t.fields5
  if (format === 6) return t.fields6
  return t.fields7
}

export function getDefaultExpr(format: CronFormat): string {
  if (format === 5) return '* * * * *'
  if (format === 6) return '0 * * * * *'
  return '0 * * * * * *'
}

export function exprToValues(expr: string, format: CronFormat): string[] {
  const parts = expr.trim().split(/\s+/)
  if (parts.length === format) return parts
  return getDefaultExpr(format).split(' ')
}

export function valuesToExpr(values: string[]): string {
  return values.join(' ')
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
    let parseExpr = expr
    if (format === 7) parseExpr = parts.slice(0, 6).join(' ')

    const description = cronToString(parseExpr, {
      use24HourTimeFormat: true,
      verbose: false,
      dayOfWeekStartIndexZero: true,
      locale,
    })
    return { valid: true, description, error: null }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return { valid: false, description: '', error: msg }
  }
}

export function getNextRuns(expr: string, format: CronFormat, count = 8): Date[] {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== format) return []
  try {
    let parseExpr = expr
    if (format === 7) parseExpr = parts.slice(0, 6).join(' ')

    const iter = CronExpressionParser.parse(parseExpr, { currentDate: new Date() })
    const results: Date[] = []
    for (let i = 0; i < count; i++) {
      try { results.push(iter.next().toDate()) } catch { break }
    }
    return results
  } catch {
    return []
  }
}
