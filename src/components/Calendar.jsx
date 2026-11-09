import { useMemo, useState } from 'react';
import { monthGrid, newId, parseKey, toKey } from '../dates.js';
import { eventsOn, REPEAT_OPTIONS, repeatLabel } from '../recurrence.js';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const emptyDraft = { id: null, title: '', time: '', notes: '', repeat: 'none' };

export default function Calendar({ events, setEvents }) {
  const today = new Date();
  const todayKey = toKey(today);
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = useState(todayKey);
  const [draft, setDraft] = useState(emptyDraft);

  const cells = useMemo(() => monthGrid(view.year, view.month), [view]);
  const dayEvents = eventsOn(events, selected);

  const shiftMonth = (delta) =>
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const goToday = () => {
    setView({ year: today.getFullYear(), month: today.getMonth() });
    setSelected(todayKey);
  };

  const submit = (e) => {
    e.preventDefault();
    const title = draft.title.trim();
    if (!title) return;
    const fields = {
      title,
      time: draft.time,
      notes: draft.notes.trim(),
      repeat: draft.repeat,
    };
    if (draft.id) {
      setEvents((prev) => prev.map((ev) => (ev.id === draft.id ? { ...ev, ...fields } : ev)));
    } else {
      setEvents((prev) => [...prev, { id: newId(), date: selected, ...fields }]);
    }
    setDraft(emptyDraft);
  };

  const edit = (ev) =>
    setDraft({
      id: ev.id,
      title: ev.title,
      time: ev.time || '',
      notes: ev.notes || '',
      repeat: ev.repeat || 'none',
    });

  const remove = (id) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
    if (draft.id === id) setDraft(emptyDraft);
  };

  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });
  const selectedLabel = parseKey(selected).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  const editing = draft.id !== null;

  return (
    <>
      <div className="card-head">
        <h2>{monthLabel}</h2>
        <div className="btn-group">
          <button className="icon" onClick={() => shiftMonth(-1)} aria-label="Previous month">
            ‹
          </button>
          <button onClick={goToday}>Today</button>
          <button className="icon" onClick={() => shiftMonth(1)} aria-label="Next month">
            ›
          </button>
        </div>
      </div>

      <div className="month" role="grid" aria-label={monthLabel}>
        {WEEKDAYS.map((d) => (
          <div key={d} className="weekday" role="columnheader">
            {d}
          </div>
        ))}
        {cells.map((date) => {
          const key = toKey(date);
          const inMonth = date.getMonth() === view.month;
          const count = eventsOn(events, key).length;
          const classes = [
            'day',
            inMonth ? '' : 'outside',
            key === todayKey ? 'today' : '',
            key === selected ? 'selected' : '',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <button
              key={key}
              className={classes}
              onClick={() => {
                setSelected(key);
                setDraft(emptyDraft);
                if (!inMonth) setView({ year: date.getFullYear(), month: date.getMonth() });
              }}
              aria-label={`${date.toDateString()}${count ? `, ${count} event${count > 1 ? 's' : ''}` : ''}`}
              aria-pressed={key === selected}
            >
              <span>{date.getDate()}</span>
              {count > 0 && <span className="dot" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <div className="day-panel">
        <h3>{selectedLabel}</h3>

        {dayEvents.length === 0 && <p className="muted">No events.</p>}
        <ul className="event-list">
          {dayEvents.map((ev) => (
            <li key={`${ev.id}-${selected}`}>
              <div>
                <strong>{ev.title}</strong>
                {ev.time && <span className="muted"> · {ev.time}</span>}
                {repeatLabel(ev.repeat) && <span className="tag">{repeatLabel(ev.repeat)}</span>}
                {ev.notes && <p className="muted small">{ev.notes}</p>}
              </div>
              <div className="btn-group">
                <button onClick={() => edit(ev)}>Edit</button>
                <button className="icon" onClick={() => remove(ev.id)} aria-label={`Delete ${ev.title}`}>
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>

        <form className="event-form" onSubmit={submit}>
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="Event title"
            aria-label="Event title"
            required
          />
          <div className="row">
            <input
              type="time"
              value={draft.time}
              onChange={(e) => setDraft({ ...draft, time: e.target.value })}
              aria-label="Time"
            />
            <select
              value={draft.repeat}
              onChange={(e) => setDraft({ ...draft, repeat: e.target.value })}
              aria-label="Repeat"
            >
              {REPEAT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <input
            value={draft.notes}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            placeholder="Notes (optional)"
            aria-label="Notes"
          />
          <div className="btn-group">
            <button type="submit">{editing ? 'Save changes' : 'Add event'}</button>
            {editing && (
              <button type="button" className="link" onClick={() => setDraft(emptyDraft)}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
