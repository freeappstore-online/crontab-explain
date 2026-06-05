import { useState, useMemo, useCallback } from 'react'
import { initApp } from '@freeappstore/sdk'
import type { Locale, Translations, FieldDef } from '../i18n'
import { LOCALES, getFields } from '../i18n'
import type { CronFormat, ParseResult } from '../cron-utils'
import { getDefaultExpr, exprToValues, valuesToExpr, parseCron, getNextRuns } from '../cron-utils'

export const fas = initApp({ appId: 'crontab-explain' })

export interface CronState {
  locale: Locale
  format: CronFormat
  expr: string
  activeExampleIdx: number | null
  t: Translations
  fields: FieldDef[]
  values: string[]
  result: ParseResult
  nextRuns: Date[]
  onLocaleChange: (l: Locale) => void
  onFormatChange: (f: CronFormat) => void
  onFieldChange: (index: number, val: string) => void
  onExprChange: (raw: string) => void
  onExample: (idx: number) => void
}

export function useCronState(): CronState {
  const [locale, setLocale] = useState<Locale>('en')
  const [format, setFormat] = useState<CronFormat>(5)
  const [expr, setExpr] = useState('* * * * *')
  const [activeExampleIdx, setActiveExampleIdx] = useState<number | null>(0)

  const t = LOCALES[locale]
  const fields = getFields(t, format)
  const values = useMemo(() => exprToValues(expr, format), [expr, format])
  const result = useMemo(() => parseCron(expr, format, locale), [expr, format, locale])
  const nextRuns = useMemo(() => result.valid ? getNextRuns(expr, format, 8) : [], [expr, format, result.valid])

  const onLocaleChange = useCallback((l: Locale) => {
    setLocale(l)
    if (activeExampleIdx !== null) {
      setExpr(LOCALES[l].examples[activeExampleIdx].expressions[format])
    }
  }, [activeExampleIdx, format])

  const onFormatChange = useCallback((f: CronFormat) => {
    setFormat(f)
    setExpr(getDefaultExpr(f))
    setActiveExampleIdx(0)
  }, [])

  const onFieldChange = useCallback((index: number, val: string) => {
    const next = [...values]
    next[index] = val || '*'
    setExpr(valuesToExpr(next))
    setActiveExampleIdx(null)
  }, [values])

  const onExprChange = useCallback((raw: string) => {
    setExpr(raw)
    setActiveExampleIdx(null)
  }, [])

  const onExample = useCallback((idx: number) => {
    setExpr(t.examples[idx].expressions[format])
    setActiveExampleIdx(idx)
  }, [t.examples, format])

  return {
    locale, format, expr, activeExampleIdx,
    t, fields, values, result, nextRuns,
    onLocaleChange, onFormatChange, onFieldChange, onExprChange, onExample,
  }
}
