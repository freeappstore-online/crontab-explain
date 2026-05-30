# crontab-explain

A free app on FreeAppStore. Parses and explains Crontab/Cronjob expressions in real-time, with Vietnamese and English UI.

- Subdomain: `crontab-explain.freeappstore.online`
- Dev: `pnpm install && pnpm dev`
- Build: `pnpm build`
- Deploy: `git push origin main` (auto-deploys to R2 via GitHub Actions)

Free, MIT-licensed, no tracking. For platform conventions (tech stack, brand tokens, mobile rules, SDK usage, deploy flow), read SKILLS.md:
[SKILLS.md](https://raw.githubusercontent.com/freeappstore-online/freeappstore/main/SKILLS.md)

## App-specific notes

- No auth required — fully client-side, no backend.
- i18n: `web/src/i18n.ts` holds all VI/EN translations; `cron-utils.ts` is locale-aware.
- Cron parsing: `cronstrue/dist/cronstrue-i18n.js` (all locales) + `cron-parser` for next-run times.
- 7-field expressions (with year) strip the year field before passing to cronstrue/cron-parser.
