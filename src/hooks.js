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
