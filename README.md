# Personal dashboard

A personal daily dashboard: weather, a monthly calendar you can edit, and a to-do list.
A static site built with React 19 + Vite. Pushing to `main` deploys it to GitHub Pages.

## Run locally

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in dist/
```

## Deploy

`.github/workflows/deploy.yml` builds the site and publishes `dist/` to GitHub Pages on every push to `main`.
One-time setup: in the repo, **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## What it does

- **Weather**: current conditions and a 5-day forecast from Open-Meteo (no API key).
  Defaults to New York; change the city or use your location.
- **Calendar**: click a day, add/edit/delete events (title, time, notes).
- **To do**: add tasks, check them off, clear completed ones.

Calendar, to-dos and the chosen city are saved in each browser's local storage.
Nothing is sent to a server.

## Where things are

```
src/App.jsx                    layout and header
src/components/Calendar.jsx    month view + events
src/components/Todos.jsx       to-do list
src/components/Weather.jsx     forecast and place search
src/storage.js                 the only place data is saved (swap for a backend later)
src/hooks.js                   usePersistentState, useNow
src/dates.js                   date helpers
.github/workflows/deploy.yml   GitHub Pages deploy from main
```
