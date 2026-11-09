import { addDays, parseKey } from '../dates.js';
import { eventsOn } from '../recurrence.js';

export default function Upcoming({ events, todos, today }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  const overdue = todos.filter((t) => !t.done && t.due && t.due < today);

  const blocks = days
    .map((key) => ({
      key,
      events: eventsOn(events, key),
      todos: todos.filter((t) => !t.done && t.due === key),
    }))
    .filter((b) => b.events.length || b.todos.length);

  const dayLabel = (key) =>
    key === today
      ? 'Today'
      : parseKey(key).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <>
      <div className="card-head">
        <h2>Next 7 days</h2>
      </div>

      {overdue.length > 0 && (
        <div className="alert">
          <strong>Overdue:</strong> {overdue.map((t) => t.title).join(', ')}
        </div>
      )}

      {blocks.length === 0 && overdue.length === 0 && <p className="muted">Nothing coming up.</p>}

      <div className="upcoming">
        {blocks.map((b) => (
          <section key={b.key}>
            <h3>{dayLabel(b.key)}</h3>
            <ul>
              {b.events.map((ev) => (
                <li key={`${ev.id}-${b.key}`}>
                  {ev.time && <span className="muted">{ev.time} </span>}
                  {ev.title}
                </li>
              ))}
              {b.todos.map((t) => (
                <li key={t.id} className="muted">
                  ☐ {t.title}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
