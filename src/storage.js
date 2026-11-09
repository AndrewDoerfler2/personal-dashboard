// All saved data goes through these two functions. Right now that is the browser's
// localStorage; to move to a server later (e.g. so scheduled Claude routines can write
// into the dashboard), only this file needs to change.
const PREFIX = 'dash.';

export function loadValue(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback; // storage blocked or corrupt: start fresh instead of crashing
  }
}

export function saveValue(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Quota exceeded or storage blocked; the in-memory state still works this session.
  }
}
