import { useState } from 'react';
import { usePersistentState } from '../hooks.js';
import { newId } from '../dates.js';

// Quick notes. Pinned notes stay at the top.
export default function Notes() {
  const [notes, setNotes] = usePersistentState('notes', []);
  const [text, setText] = useState('');

  const add = (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setNotes((prev) => [{ id: newId(), text: body, pinned: false, createdAt: new Date().toISOString() }, ...prev]);
    setText('');
  };

  const togglePin = (id) =>
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));

  const remove = (id) => setNotes((prev) => prev.filter((n) => n.id !== id));

  const sorted = [...notes].sort(
    (a, b) => Number(b.pinned) - Number(a.pinned) || (b.createdAt || '').localeCompare(a.createdAt || ''),
  );

  return (
    <>
      <div className="card-head">
        <h2>Quick notes</h2>
      </div>

      <form className="row" onSubmit={add}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Jot something down" aria-label="New note" />
        <button type="submit">Add</button>
      </form>

      {sorted.length === 0 && <p className="muted">No notes yet.</p>}
      <ul className="note-list">
        {sorted.map((n) => (
          <li key={n.id} className={n.pinned ? 'pinned' : undefined}>
            <p>{n.text}</p>
            <div className="btn-group">
              <button className="link" onClick={() => togglePin(n.id)}>
                {n.pinned ? 'Unpin' : 'Pin'}
              </button>
              <button className="icon" onClick={() => remove(n.id)} aria-label="Delete note">
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
