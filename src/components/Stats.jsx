import { addDays, parseKey, toKey } from '../dates.js';

// To-dos completed per day over the last 7 days.
export default function Stats({ todos, today }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const counts = days.map(
    (key) => todos.filter((t) => t.doneAt && toKey(new Date(t.doneAt)) === key).length,
  );
  const max = Math.max(1, ...counts);
  const total = counts.reduce((a, b) => a + b, 0);

  return (
    <>
      <div className="bars" role="img" aria-label={`${total} tasks completed in the last 7 days`}>
        {days.map((key, i) => (
          <div key={key} className="bar-col">
            <span className="small muted">{counts[i] || ''}</span>
            <div className="bar-track">
              <div
                className="bar"
                style={{ height: `${counts[i] ? Math.max((counts[i] / max) * 100, 8) : 0}%` }}
              />
            </div>
            <span className="small muted">
              {parseKey(key).toLocaleDateString(undefined, { weekday: 'narrow' })}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
