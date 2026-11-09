import { useJsonFile } from '../hooks.js';

// Status published by scheduled Claude routines to public/data/routines.json:
//   [{ "name": "...", "lastRun": "2026-11-09T07:00:00Z", "status": "ok" | "failed", "summary": "...", "url": "optional" }]
function timeAgo(iso) {
  const when = new Date(iso);
  if (Number.isNaN(when.getTime())) return '';
  const mins = Math.round((Date.now() - when) / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  return when.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function Routines() {
  const { data, error } = useJsonFile('./data/routines.json');

  if (data === null) return <p className="muted">Loading…</p>;

  const routines = [...data].sort((a, b) => (b.lastRun || '').localeCompare(a.lastRun || ''));

  return (
    <>

      {error && <p className="error small">{error}</p>}
      {routines.length === 0 && !error && <p className="muted">No routines reporting yet.</p>}

      <ul className="routine-list">
        {routines.map((r) => (
          <li key={r.name}>
            <div className="routine-head">
              <span className={`status-dot ${r.status === 'ok' ? 'ok' : 'failed'}`} aria-hidden="true" />
              <strong>{r.name}</strong>
              <span className="small muted">{timeAgo(r.lastRun)}</span>
            </div>
            {r.summary && <p className="small">{r.summary}</p>}
            {r.url && /^https?:\/\//.test(r.url) && (
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="small">
                Latest output
              </a>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
