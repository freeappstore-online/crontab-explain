import type { Translations, FieldDef } from '../i18n'
import type { CronFormat, ParseResult } from '../cron-utils'
import { getDefaultExpr } from '../cron-utils'
import { CronFieldInput, StatusBadge } from './ui'

interface Props {
  t: Translations
  format: CronFormat
  expr: string
  fields: FieldDef[]
  values: string[]
  result: ParseResult
  activeExampleIdx: number | null
  onFormatChange: (f: CronFormat) => void
  onFieldChange: (index: number, val: string) => void
  onExprChange: (raw: string) => void
  onExample: (idx: number) => void
}

export function CronBuilder({
  t, format, expr, fields, values, result, activeExampleIdx,
  onFormatChange, onFieldChange, onExprChange, onExample,
}: Props) {
  return (
    <>
      {/* Format Selector */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4 space-y-3 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{t.formatSection}</p>
        <div className="flex flex-wrap gap-2">
          {([5, 6, 7] as CronFormat[]).map(f => (
            <button
              key={f}
              onClick={() => onFormatChange(f)}
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

      {/* Expression Builder */}
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
              onChange={v => onFieldChange(i, v)}
              placeholder={f.placeholder}
            />
          ))}
        </div>

        {/* Raw expression input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{t.exprLabel}</label>
          <div className="relative">
            <input
              type="text"
              value={expr}
              onChange={e => onExprChange(e.target.value)}
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
              onClick={() => onExample(idx)}
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
    </>
  )
}
