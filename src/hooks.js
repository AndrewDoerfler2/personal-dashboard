import { useEffect, useState } from 'react';
import { loadValue, saveValue } from './storage.js';

// Like useState, but the value is loaded from and saved to storage automatically.
export function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => loadValue(key, fallback));
  useEffect(() => {
    saveValue(key, value);
  }, [key, value]);
  return [value, setValue];
}

// The current time, refreshed every `intervalMs`.
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

// Loads a JSON array published alongside the site (e.g. ./data/learning.json).
// A missing file counts as an empty list, so sections work before anything has been published.
export function useJsonFile(path) {
  const [state, setState] = useState({ data: null, error: null });
  useEffect(() => {
    const controller = new AbortController();
    fetch(path, { signal: controller.signal, cache: 'no-cache' })
      .then((res) => {
        if (res.status === 404) return [];
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => setState({ data: Array.isArray(json) ? json : [], error: null }))
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ data: [], error: 'Could not load this section.' });
      });
    return () => controller.abort();
  }, [path]);
  return state;
}
