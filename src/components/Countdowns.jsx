import { useState } from 'react';
import { usePersistentState } from '../hooks.js';
import { daysBetween, newId, parseKey } from '../dates.js';

const plural = (n) => (n === 1 ? 'day' : 'days');

function describe(days) {
  if (days === 0) return 'Today';
  if (days > 0) return `${days} ${plural(days)} to go`;
  return `${-days} ${plural(-days)} ago`;
}

export default function Countdowns({ today }) {
  const [items, setItems] = usePersistentState('countdowns', []);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const add = (e) => {
    e.preventDefault();
    if (!name.trim() || !date) return;
    setItems((prev) => [...prev, { id: newId(), name: name.trim(), date }]);
    setName('');
    setDate('');
  };

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <div className="card-head">
        <h2>Countdowns</h2>
      </div>

      {sorted.length === 0 && <p className="muted">Add a date you're counting toward.</p>}
      <ul className="countdown-list">
        {sorted.map((item) => {
          const days = daysBetween(today, item.date);
          return (
            <li key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <div className="muted small">
                  {parseKey(item.date).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
              <div className="countdown-days">
                <span className="big-num">{Math.abs(days)}</span>
                <span className="small muted">{describe(days)}</span>
              </div>
              <button className="icon" onClick={() => remove(item.id)} aria-label={`Delete ${item.name}`}>
                ×
              </button>
            </li>
          );
        })}
      </ul>

      <form className="row" onSubmit={add}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" aria-label="Countdown name" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Countdown date" />
        <button type="submit">Add</button>
      </form>
    </>
  );
}
