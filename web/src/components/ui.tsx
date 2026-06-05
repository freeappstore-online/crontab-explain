import type { Locale } from '../i18n'

export function CronFieldInput({
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

export function StatusBadge({ color, children }: { color: 'green' | 'red' | 'blue'; children: React.ReactNode }) {
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

export function LangToggle({ locale, onChange }: { locale: Locale; onChange: (l: Locale) => void }) {
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
