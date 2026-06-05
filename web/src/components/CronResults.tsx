import type { Translations, FieldDef } from '../i18n'
import type { ParseResult } from '../cron-utils'
import { StatusBadge } from './ui'

function formatDate(d: Date, weekdayShort: string[]): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} ` +
    `${weekdayShort[d.getUTCDay()]} ` +
    `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`
  )
}

interface Props {
  t: Translations
  expr: string
  fields: FieldDef[]
  values: string[]
  result: ParseResult
  nextRuns: Date[]
}

export function CronResults({ t, expr, fields, values, result, nextRuns }: Props) {
  if (!result.valid) return null

  return (
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
                return (
                  <tr
                    key={f.id}
                    className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--paper-deep)]/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-[var(--ink)]">{f.label}</td>
                    <td className="px-4 py-3 font-mono text-[var(--accent)]">{val}</td>
                    <td className="px-4 py-3 text-xs text-[var(--muted)]">{f.range}</td>
                    <td className="px-4 py-3 text-[var(--ink)]">{t.describeField(f.id, val)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Special characters reference */}
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
  )
}
