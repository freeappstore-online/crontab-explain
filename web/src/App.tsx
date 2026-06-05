import { Shell, BuildInfo, useStandalone } from '@freeappstore/sdk/ui'
import { useCronState, fas } from './hooks/useCronState'
import { LangToggle } from './components/ui'
import { CronBuilder } from './components/CronBuilder'
import { CronResults } from './components/CronResults'

export default function App() {
  const state = useCronState()
  const { t, locale, format, expr, fields, values, result, nextRuns, activeExampleIdx } = state
  const standalone = useStandalone()

  return (
    <Shell app={fas} appName="Crontab Explanation" requireAuth={false} showThemeToggle={true}>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div
          className="mx-auto w-full max-w-4xl px-4 py-6 space-y-6"
          style={standalone ? { paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom, 0px))' } : undefined}
        >

          {/* Header */}
          <div className="relative text-center space-y-2">
            <div className="absolute right-0 top-0">
              <LangToggle locale={locale} onChange={state.onLocaleChange} />
            </div>
            <h1 className="display-font text-3xl font-bold text-[var(--ink)]">Crontab Explanation</h1>
            <p className="text-sm text-[var(--muted)]">{t.subtitle}</p>
          </div>

          <CronBuilder
            t={t}
            format={format}
            expr={expr}
            fields={fields}
            values={values}
            result={result}
            activeExampleIdx={activeExampleIdx}
            onFormatChange={state.onFormatChange}
            onFieldChange={state.onFieldChange}
            onExprChange={state.onExprChange}
            onExample={state.onExample}
          />

          <CronResults
            t={t}
            expr={expr}
            fields={fields}
            values={values}
            result={result}
            nextRuns={nextRuns}
          />

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
