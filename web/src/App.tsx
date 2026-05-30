import { useState, useMemo, useCallback } from 'react'
import { initApp } from '@freeappstore/sdk'
import { Shell, BuildInfo } from '@freeappstore/sdk/ui'
import type { Locale } from './i18n'
import { LOCALES } from './i18n'
import type { CronFormat } from './cron-utils'
import {
  getFields,
  getDefaultExpr,
  exprToValues,
  valuesToExpr,
  parseCron,
  getNextRuns,
} from './cron-utils'

const fas = initApp({ appId: 'crontab-explain' })

function formatDate(d: Date, weekdayShort: string[]): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} ` +
    `${weekdayShort[d.getUTCDay()]} ` +
    `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`
  )
}

function CronFieldInput({
  value, onChange, placeholder, label,
}: {
  value: string; onChange: (v: string) => void; placeholder: string; label: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--paper-deep)] px-3 py-2 text-center font-mono text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
      />
    </div>
  )
}

function StatusBadge({ color, children }: { color: 'green' | 'red' | 'blue'; children: React.ReactNode }) {
  const cls = {
    green: 'bg-[var(--mint-soft)] text-[var(--mint-deep)] border-[var(--mint-soft)]',
    red: 'bg-[color-mix(in_srgb,var(--error)_12%,transparent)] text-[var(--error)] border-[color-mix(in_srgb,var(--error)_20%,transparent)]',
    blue: 'bg-[var(--sky-soft)] text-[var(--sky-deep)] border-[var(--sky-soft)]',
  }[color]
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {children}
    </span>
  )
}

function LangToggle({ locale, onChange }: { locale: Locale; onChange: (l: Locale) => void }) {
  return (
    <div className="flex items-center rounded-xl border border-[var(--line-strong)] bg-[var(--paper-deep)] p-0.5 gap-0.5">
      {(['vi', 'en'] as Locale[]).map(l => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`rounded-[10px] px-3 py-1 text-xs font-bold tracking-wider transition-all ${
            locale === l
              ? 'bg-[var(--accent)] text-white shadow-sm'
              : 'text-[var(--muted)] hover:text-[var(--ink)]'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export default function App() {
  const [locale, setLocale] = useState<Locale>('en')
  const [format, setFormat] = useState<CronFormat>(5)
  const [expr, setExpr] = useState('* * * * *')
  const [activeExampleIdx, setActiveExampleIdx] = useState<number | null>(0)

  const t = LOCALES[locale]
  const fields = getFields(format, locale)
  const values = useMemo(() => exprToValues(expr, format), [expr, format])

  const handleFieldChange = useCallback((index: number, val: string) => {
    const next = [...values]
    next[index] = val || '*'
    setExpr(valuesToExpr(next))
    setActiveExampleIdx(null)
  }, [values])

  const handleExprChange = useCallback((raw: string) => {
    setExpr(raw)
    setActiveExampleIdx(null)
  }, [])

  const handleFormatChange = useCallback((f: CronFormat) => {
    setFormat(f)
    setExpr(getDefaultExpr(f))
    setActiveExampleIdx(0)
  }, [])

  const handleExample = useCallback((idx: number) => {
    setExpr(t.examples[idx].expressions[format])
    setActiveExampleIdx(idx)
  }, [t.examples, format])

  const handleLocaleChange = useCallback((l: Locale) => {
    setLocale(l)
    // Keep active example expression but re-derive from same index
    if (activeExampleIdx !== null) {
      setExpr(LOCALES[l].examples[activeExampleIdx].expressions[format])
    }
  }, [activeExampleIdx, format])

  const result = useMemo(() => parseCron(expr, format, locale), [expr, format, locale])
  const nextRuns = useMemo(() => result.valid ? getNextRuns(expr, format, 8) : [], [expr, format, result.valid])

  return (
    <Shell app={fas} appName="Crontab Explanation">
      <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 space-y-6">

        {/* Header */}
        <div className="relative text-center space-y-2">
          <div className="absolute right-0 top-0">
            <LangToggle locale={locale} onChange={handleLocaleChange} />
          </div>
          <h1 className="display-font text-3xl font-bold text-[var(--ink)]">Crontab Explanation</h1>
          <p className="text-sm text-[var(--muted)]">{t.subtitle}</p>
        </div>

        {/* Format Selector */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 space-y-3 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{t.formatSection}</p>
          <div className="flex flex-wrap gap-2">
            {([5, 6, 7] as CronFormat[]).map(f => (
              <button
                key={f}
                onClick={() => handleFormatChange(f)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all border ${
                  format === f
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-sm'
                    : 'bg-[var(--paper-deep)] text-[var(--ink)] border-[var(--line-strong)] hover:border-[var(--accent)]/40'
                }`}
              >
                {t.formatLabels[f]}
              </button>
            ))}
          </div>
        </div>

        {/* Field Builder */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 space-y-4 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{t.builderSection}</p>
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${format}, minmax(0, 1fr))` }}
          >
            {fields.map((f, i) => (
              <CronFieldInput
                key={f.id}
                label={f.label}
                value={values[i] ?? '*'}
                onChange={v => handleFieldChange(i, v)}
                placeholder={f.placeholder}
              />
            ))}
          </div>

          {/* Combined expression */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{t.exprLabel}</label>
            <div className="relative">
              <input
                type="text"
                value={expr}
                onChange={e => handleExprChange(e.target.value)}
                spellCheck={false}
                autoComplete="off"
                placeholder={getDefaultExpr(format)}
                className="w-full rounded-xl border border-[var(--line-strong)] bg-[var(--paper-deep)] px-4 py-3 font-mono text-base text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all pr-28"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {result.valid
                  ? <StatusBadge color="green">{t.validBadge}</StatusBadge>
                  : <StatusBadge color="red">{t.errorBadge}</StatusBadge>}
              </div>
            </div>
            {!result.valid && result.error && (
              <p className="text-xs text-[var(--error)] px-1">{result.error}</p>
            )}
          </div>
        </div>

        {/* Common Examples */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 space-y-3 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{t.examplesSection}</p>
          <div className="flex flex-wrap gap-2">
            {t.examples.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => handleExample(idx)}
                title={ex.description}
                className={`rounded-xl px-3 py-1.5 text-sm font-medium border transition-all ${
                  activeExampleIdx === idx
                    ? 'bg-[var(--sky)] text-white border-[var(--sky)] shadow-sm'
                    : 'bg-[var(--paper-deep)] text-[var(--ink)] border-[var(--line-strong)] hover:border-[var(--sky)]/50'
                }`}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {result.valid && (
          <>
            {/* Explanation */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 space-y-3 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{t.explanationSection}</p>
              <div className="flex items-start gap-3 rounded-xl bg-[var(--accent-soft)] border border-[color-mix(in_srgb,var(--accent)_20%,transparent)] p-4">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white text-xs">✦</div>
                <div className="space-y-1">
                  <p className="font-mono text-sm font-semibold text-[var(--ink)]">{expr}</p>
                  <p className="text-sm text-[var(--ink)]">{result.description}</p>
                </div>
              </div>
            </div>

            {/* Field Analysis */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 space-y-3 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{t.fieldAnalysisSection}</p>
              <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
                <table className="w-full text-sm min-w-[480px]">
                  <thead>
                    <tr className="border-b border-[var(--line)] bg-[var(--paper-deep)]">
                      {[t.tableField, t.tableValue, t.tableRange, t.tableMeaning].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((f, i) => {
                      const val = values[i] ?? '*'
                      const meaning = t.describeField(f.id, val)
                      return (
                        <tr
                          key={f.id}
                          className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--paper-deep)]/50 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-[var(--ink)]">{f.label}</td>
                          <td className="px-4 py-3 font-mono text-[var(--accent)]">{val}</td>
                          <td className="px-4 py-3 text-xs text-[var(--muted)]">{f.range}</td>
                          <td className="px-4 py-3 text-[var(--ink)]">{meaning}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Specials reference */}
              <div className="rounded-xl bg-[var(--paper-deep)] border border-[var(--line)] p-3 space-y-1.5">
                <p className="text-xs font-semibold text-[var(--muted)]">{t.specialsTitle}</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-[var(--muted)]">
                  {t.specials.map(s => (
                    <span key={s.char}>
                      <code className="text-[var(--ink)]">{s.char}</code> — {s.desc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Runs */}
            {nextRuns.length > 0 && (
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 space-y-3 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  {t.nextRunsSection}
                  <span className="ml-2 normal-case font-normal">{t.nextRunsSuffix}</span>
                </p>
                <div className="space-y-2">
                  {nextRuns.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--paper-deep)] px-4 py-2.5 hover:bg-[var(--paper-deep)]/80 transition-colors"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--sky-soft)] text-[var(--sky-deep)] text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="font-mono text-sm text-[var(--ink)]">{formatDate(d, t.weekdayShort)}</span>
                      {i === 0 && <StatusBadge color="blue">{t.nextBadge}</StatusBadge>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        {/* Store link */}
        <p className="pb-2 text-center text-xs text-[var(--muted)]">
          Built for{' '}
          <a
            href="https://freeappstore.online"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[var(--ink)] transition-colors"
          >
            freeappstore.online
          </a>
        </p>
      </div>
      </div>

      <BuildInfo />
    </Shell>
  )
}
