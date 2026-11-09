// Recurring calendar events. An event is stored once with its first date and a `repeat` rule;
// occursOn() answers whether it happens on a given day.
import { parseKey } from './dates.js';

export const REPEAT_OPTIONS = [
  { value: 'none', label: 'Does not repeat' },
  { value: 'daily', label: 'Every day' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'weekly', label: 'Every week' },
];

const SHORT = { daily: 'Daily', weekdays: 'Weekdays', weekly: 'Weekly' };
export const repeatLabel = (repeat) => SHORT[repeat] ?? '';

export function occursOn(ev, key) {
  if (key < ev.date) return false; // keys are YYYY-MM-DD, so string order is date order
  if (key === ev.date) return true;
  const dow = parseKey(key).getDay();
  switch (ev.repeat) {
    case 'daily':
      return true;
    case 'weekdays':
      return dow >= 1 && dow <= 5;
    case 'weekly':
      return parseKey(ev.date).getDay() === dow;
    default:
      return false;
  }
}

export function eventsOn(events, key) {
  return events
    .filter((ev) => occursOn(ev, key))
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
}
