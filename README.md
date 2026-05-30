# Crontab Explanation

> Parse and explain Crontab/Cronjob expressions in real-time — with Vietnamese 🇻🇳 and English 🇬🇧 support.

**Live:** [crontab-explain.freeappstore.online](https://crontab-explain.freeappstore.online)  
**Platform:** [FreeAppStore](https://freeappstore.online) — free, MIT-licensed, no tracking.

---

## Features

- **Expression builder** — individual input fields for each cron field; edits sync bidirectionally with the raw expression input
- **3 formats** — 5-field (standard), 6-field (+ second), 7-field (+ second + year)
- **13 common examples** — one click populates all fields and the expression at once
- **Human-readable explanation** — powered by [`cronstrue`](https://github.com/bradymholt/cronstrue) with full Vietnamese and English locale support
- **Field analysis table** — shows each field's value, allowed range, and plain-language meaning
- **Next 8 scheduled runs** — calculated via [`cron-parser`](https://github.com/harrisiirak/cron-parser), displayed in UTC
- **Language toggle** — switch between VI / EN at any time without losing state
- **PWA** — installable on any device, works offline

## Tech stack

| Layer            | Choice                        |
| ---------------- | ----------------------------- |
| Framework        | React 19 + Vite 8             |
| Styling          | Tailwind CSS v4               |
| Cron parsing     | `cron-parser` v5              |
| Cron description | `cronstrue` v3 (i18n bundle)  |
| Shell / auth     | `@freeappstore/sdk`           |
| PWA              | `vite-plugin-pwa` + Workbox   |

## Development

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # production build → web/dist/
pnpm typecheck  # TypeScript check only
```

Quality checks (same gates as CI):

```bash
fas check         # compliance: license, brand, PWA, bundle size …
fas screencheck   # layout on 12 reference viewports (portrait + landscape)
```

## Project structure

```text
web/
  src/
    App.tsx        # main UI, language state, all sections
    i18n.ts        # VI / EN translations and example definitions
    cron-utils.ts  # locale-aware cron parsing and next-run calculation
    index.css      # brand tokens, dark mode, viewport constraints
  public/
    manifest.json  # PWA manifest (min_viewport_width: 360)
    icon-192.png
    icon-512.png
  index.html
  vite.config.ts
```

## Deploy

Push to `main` — GitHub Actions builds and deploys to Cloudflare R2 automatically.

```bash
git push origin main
```

## License

MIT
