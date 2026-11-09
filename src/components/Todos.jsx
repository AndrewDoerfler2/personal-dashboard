import { useState } from 'react';
import { usePersistentState } from '../hooks.js';
import { newId } from '../dates.js';

export default function Todos() {
  const [todos, setTodos] = usePersistentState('todos', []);
  const [text, setText] = useState('');

  const add = (e) => {
    e.preventDefault();
    const title = text.trim();
    if (!title) return;
    setTodos((prev) => [...prev, { id: newId(), title, done: false }]);
    setText('');
  };

  const toggle = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));

  const clearDone = () => setTodos((prev) => prev.filter((t) => !t.done));

  const open = todos.filter((t) => !t.done).length;
  const doneCount = todos.length - open;

  return (
    <>
      <div className="card-head">
        <h2>To do</h2>
        <span className="muted small">{open} open</span>
      </div>

      <form className="row" onSubmit={add}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task"
          aria-label="New task"
        />
        <button type="submit">Add</button>
      </form>

      {todos.length === 0 && <p className="muted">Nothing here yet.</p>}

      <ul className="todo-list">
        {todos.map((t) => (
          <li key={t.id} className={t.done ? 'done' : undefined}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
              <span>{t.title}</span>
            </label>
            <button className="icon" onClick={() => remove(t.id)} aria-label={`Delete ${t.title}`}>
              ×
            </button>
          </li>
        ))}
      </ul>

      {doneCount > 0 && (
        <button className="link" onClick={clearDone}>
          Clear {doneCount} completed
        </button>
      )}
    </>
  );
}
