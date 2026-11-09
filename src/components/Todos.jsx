import { useState } from 'react';
import { newId, parseKey } from '../dates.js';

const PRIORITY_RANK = { high: 0, normal: 1, low: 2 };

const formatDue = (key) =>
  parseKey(key).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

export default function Todos({ todos, setTodos, today }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('normal');
  const [due, setDue] = useState('');

  const add = (e) => {
    e.preventDefault();
    const title = text.trim();
    if (!title) return;
    setTodos((prev) => [
      ...prev,
      { id: newId(), title, done: false, priority, due, doneAt: null },
    ]);
    setText('');
    setDue('');
  };

  const toggle = (id) =>
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, done: !t.done, doneAt: !t.done ? new Date().toISOString() : null }
          : t,
      ),
    );

  const remove = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));

  const clearDone = () => setTodos((prev) => prev.filter((t) => !t.done));

  // Open tasks first, then by due date (no date last), then by priority.
  const sorted = [...todos].sort(
    (a, b) =>
      Number(a.done) - Number(b.done) ||
      (a.due || '9999-99-99').localeCompare(b.due || '9999-99-99') ||
      (PRIORITY_RANK[a.priority] ?? 1) - (PRIORITY_RANK[b.priority] ?? 1),
  );

  const open = todos.filter((t) => !t.done).length;
  const doneCount = todos.length - open;

  return (
    <>
      <div className="card-head">
        <h2>To do</h2>
        <span className="muted small">{open} open</span>
      </div>

      <form className="todo-form" onSubmit={add}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task"
          aria-label="New task"
        />
        <div className="row">
          <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority">
            <option value="high">High priority</option>
            <option value="normal">Normal</option>
            <option value="low">Low priority</option>
          </select>
          <input type="date" value={due} onChange={(e) => setDue(e.target.value)} aria-label="Due date" />
          <button type="submit">Add</button>
        </div>
      </form>

      {todos.length === 0 && <p className="muted">Nothing here yet.</p>}

      <ul className="todo-list">
        {sorted.map((t) => {
          const overdue = !t.done && t.due && t.due < today;
          return (
            <li key={t.id} className={t.done ? 'done' : undefined}>
              <label>
                <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
                <div>
                  <span>{t.title}</span>
                  <div className="meta">
                    {t.priority === 'high' && !t.done && <span className="tag high">High</span>}
                    {t.due && (
                      <span className={overdue ? 'tag overdue' : 'tag'}>
                        {overdue ? 'Overdue · ' : ''}
                        {formatDue(t.due)}
                      </span>
                    )}
                  </div>
                </div>
              </label>
              <button className="icon" onClick={() => remove(t.id)} aria-label={`Delete ${t.title}`}>
                ×
              </button>
            </li>
          );
        })}
      </ul>

      {doneCount > 0 && (
        <button className="link" onClick={clearDone}>
          Clear {doneCount} completed
        </button>
      )}
    </>
  );
}
