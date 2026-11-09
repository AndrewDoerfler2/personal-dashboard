# CLAUDE.md — personal-dashboard

Personal daily dashboard. Static site: React 19 + Vite, deployed to GitHub Pages from `main`
by `.github/workflows/deploy.yml`. See README.md for the file map.

## Conventions

- Keep it static and dependency-light: only react, react-dom, vite and @vitejs/plugin-react.
- Keep `base: './'` in `vite.config.js` so assets resolve under the Pages project path.
- All persistence goes through `src/storage.js` (localStorage today, keys prefixed `dash.`).
  `usePersistentState(key, fallback)` wraps it for components.
- Colors are CSS variables on `:root` with dark-mode overrides in `src/style.css`. Keep them there.
- Weather uses Open-Meteo (no key). Keep requests in `Weather.jsx`.
- Calendar and to-do state lives in `App.jsx` and is passed down; other cards keep their own state.
- Smaller cards in the right column are wrapped in `<Collapsible title=...>` (closed by default). Components render only their body, not a header.

## Routine output

- Routines publish to `public/data/learning.json` and `public/data/routines.json` (format in README.md).
  Committing those files to `main` redeploys the site. Components read them via `useJsonFile`.
- Calendar sync with Google/Outlook is not built; it needs a backend for sign-in.

## Verifying changes

- `npm ci && npm run build` must pass. There is no test runner, by design.
- Pushing to `main` deploys; check the Actions tab if the live site doesn't update.
