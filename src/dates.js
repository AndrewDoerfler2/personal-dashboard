// Date helpers. Keys look like "2026-11-09" and always use local time, so a day never shifts
// because of timezone conversion.
export function toKey(date) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

export function parseKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key, n) {
  const d = parseKey(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
}

// Whole calendar days from one key to another (DST-safe).
export function daysBetween(from, to) {
  return Math.round((parseKey(to) - parseKey(from)) / 86_400_000);
}

// 6 weeks (42 days) starting on the Sunday on or before the 1st of the month.
export function monthGrid(year, month) {
  const first = new Date(year, month, 1);
  const start = new Date(year, month, 1 - first.getDay());
  return Array.from(
    { length: 42 },
    (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i),
  );
}

export function newId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  // randomUUID needs a secure context (https or localhost); fall back for plain http on a LAN.
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
