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

## Planned

- Scheduled Claude routines will write their output into the dashboard (e.g. a "learning" card).
  That needs a data source outside the browser. Add it behind `storage.js` or a new `src/api.js`,
  not inside the components.

## Verifying changes

- `npm ci && npm run build` must pass. There is no test runner, by design.
- Pushing to `main` deploys; check the Actions tab if the live site doesn't update.
