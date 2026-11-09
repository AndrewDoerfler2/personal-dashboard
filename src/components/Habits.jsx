import { useState } from 'react';
import { usePersistentState } from '../hooks.js';
import { addDays, newId, parseKey } from '../dates.js';

// Last 7 days, ending today. Each habit stores { done: { 'YYYY-MM-DD': true } }.
export default function Habits({ today }) {
  const [habits, setHabits] = usePersistentState('habits', []);
  const [name, setName] = useState('');
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));

  const add = (e) => {
    e.preventDefault();
    const title = name.trim();
    if (!title) return;
    setHabits((prev) => [...prev, { id: newId(), name: title, done: {} }]);
    setName('');
  };

  const toggle = (id, key) =>
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, done: { ...h.done, [key]: !h.done?.[key] } } : h,
      ),
    );

  const remove = (id) => setHabits((prev) => prev.filter((h) => h.id !== id));

  return (
    <>
      <div className="card-head">
        <h2>Habits</h2>
        <span className="muted small">last 7 days</span>
      </div>

      {habits.length === 0 && <p className="muted">Track something you want to do every day.</p>}

      {habits.length > 0 && (
        <div className="habits">
          <div className="habit-row header" aria-hidden="true">
            <span />
            {days.map((key) => (
              <span key={key} className="small muted">
                {parseKey(key).toLocaleDateString(undefined, { weekday: 'narrow' })}
              </span>
            ))}
            <span />
          </div>
          {habits.map((h) => {
            const count = days.filter((k) => h.done?.[k]).length;
            return (
              <div key={h.id} className="habit-row">
                <span className="habit-name">
                  {h.name} <span className="muted small">{count}/7</span>
                </span>
                {days.map((key) => {
                  const on = !!h.done?.[key];
                  return (
                    <button
                      key={key}
                      className={`check ${on ? 'on' : ''}`}
                      onClick={() => toggle(h.id, key)}
                      aria-pressed={on}
                      aria-label={`${h.name} on ${key}`}
                    >
                      {on ? '✓' : ''}
                    </button>
                  );
                })}
                <button className="icon" onClick={() => remove(h.id)} aria-label={`Delete ${h.name}`}>
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      <form className="row" onSubmit={add}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New habit" aria-label="New habit" />
        <button type="submit">Add</button>
      </form>
    </>
  );
}
