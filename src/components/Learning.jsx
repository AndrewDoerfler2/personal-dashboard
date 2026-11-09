import { useState } from 'react';
import { usePersistentState, useJsonFile } from '../hooks.js';

// Entries published by scheduled Claude routines to public/data/learning.json:
//   [{ "id": "2026-11-09-rust", "date": "2026-11-09", "title": "...", "body": "...", "url": "optional" }]
const LATEST = 3;

export default function Learning() {
  const { data, error } = useJsonFile('./data/learning.json');
  const [read, setRead] = usePersistentState('learningRead', []);
  const [showAll, setShowAll] = useState(false);

  const toggleRead = (id) =>
    setRead((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  if (data === null) return <p className="muted">Loading…</p>;

  const entries = [...data].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const unread = entries.filter((e) => !read.includes(e.id)).length;
  const visible = showAll ? entries : entries.slice(0, LATEST);

  return (
    <>

      {error && <p className="error small">{error}</p>}
      {entries.length === 0 && !error && <p className="muted">No entries yet. Scheduled routines will add them here.</p>}

      <ul className="entry-list">
        {visible.map((e) => {
          const isRead = read.includes(e.id);
          return (
            <li key={e.id} className={isRead ? 'read' : undefined}>
              <div className="meta">
                <span className="small muted">{e.date}</span>
              </div>
              <strong>{e.title}</strong>
              {e.body && <p className="small">{e.body}</p>}
              <div className="btn-group">
                {e.url && /^https?:\/\//.test(e.url) && (
                  <a href={e.url} target="_blank" rel="noopener noreferrer" className="small">
                    Open
                  </a>
                )}
                <label className="small check-label">
                  <input type="checkbox" checked={isRead} onChange={() => toggleRead(e.id)} /> Read
                </label>
              </div>
            </li>
          );
        })}
      </ul>

      {entries.length > LATEST && (
        <button className="link" onClick={() => setShowAll((v) => !v)}>
          {showAll ? 'Show latest only' : `Show archive (${entries.length})`}
        </button>
      )}
    </>
  );
}
