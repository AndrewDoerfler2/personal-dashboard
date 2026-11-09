import { useState } from 'react';
import { usePersistentState } from '../hooks.js';
import { newId } from '../dates.js';

// Accepts "example.com" as well as full URLs.
function normalizeUrl(raw) {
  const value = raw.trim();
  const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('bad protocol');
  return url.href;
}

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = usePersistentState('bookmarks', []);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);

  const add = (e) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    try {
      const href = normalizeUrl(url);
      setBookmarks((prev) => [...prev, { id: newId(), name: name.trim(), url: href }]);
      setName('');
      setUrl('');
      setError(null);
    } catch {
      setError('That address does not look valid.');
    }
  };

  const remove = (id) => setBookmarks((prev) => prev.filter((b) => b.id !== id));

  return (
    <>

      {bookmarks.length === 0 && <p className="muted">Save the sites you open every day.</p>}
      <ul className="bookmark-list">
        {bookmarks.map((b) => (
          <li key={b.id}>
            <a href={b.url} target="_blank" rel="noopener noreferrer">
              {b.name}
            </a>
            <button className="icon" onClick={() => remove(b.id)} aria-label={`Delete ${b.name}`}>
              ×
            </button>
          </li>
        ))}
      </ul>

      <form className="bookmark-form" onSubmit={add}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" aria-label="Bookmark name" />
        <div className="row">
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="example.com" aria-label="Bookmark address" />
          <button type="submit">Add</button>
        </div>
      </form>
      {error && <p className="error small">{error}</p>}
    </>
  );
}
