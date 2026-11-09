# Personal dashboard

A personal daily dashboard. A static site built with React 19 + Vite. Pushing to `main` deploys it to GitHub Pages.

## Run locally

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in dist/
```

## Deploy

`.github/workflows/deploy.yml` builds the site and publishes `dist/` to GitHub Pages on every push to `main`.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Cards

- **Weather**: conditions, 5-day forecast, sunrise/sunset and 24-hour alerts (Open-Meteo, no API key).
- **Calendar**: month view; events can repeat daily, on weekdays, or weekly.
- **To do**: priorities and due dates; overdue items are flagged.
- **Next 7 days**: upcoming events and due tasks in one list.
- **Countdowns**: days until (or since) a date.
- **Habits**: check off each day for the last 7 days.
- **Quick notes**: pin the ones you want at the top.
- **Bookmarks**: links to the sites you open daily.
- **Learning** and **Routines**: read from published JSON files (see below).
- **Completed this week**: to-dos finished per day.

Everything you enter is saved in this browser's local storage. Nothing is sent to a server.

## Routine output

Scheduled Claude routines publish to two files in `public/data/`. Committing a change to either file and pushing to `main` redeploys the site.

`public/data/learning.json`: an array of entries.
```json
[{ "id": "2026-11-09-rust", "date": "2026-11-09", "title": "Ownership basics", "body": "Short summary", "url": "https://example.com" }]
```

`public/data/routines.json`: one status object per routine (latest run only).
```json
[{ "name": "Daily learning", "lastRun": "2026-11-09T12:00:00Z", "status": "ok", "summary": "Wrote 1 entry", "url": "https://example.com" }]
```

`id` must be unique per entry; `url` and `summary` are optional.

## Where things are

```
src/App.jsx                    layout; owns the calendar and to-do state
src/components/                one file per card
src/storage.js                 the only place local data is saved
src/hooks.js                   usePersistentState, useNow, useJsonFile
src/recurrence.js              repeating calendar events
src/dates.js                   date helpers
public/data/                   learning.json and routines.json (published by routines)
.github/workflows/deploy.yml   GitHub Pages deploy from main
```
