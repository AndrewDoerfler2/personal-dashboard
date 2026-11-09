// Dashboard layout. Weather and the calendar sit on the left; to-dos and the smaller cards
// stack on the right. Calendar and to-do state lives here so the summary cards stay in sync.
import Bookmarks from './components/Bookmarks.jsx';
import Calendar from './components/Calendar.jsx';
import Countdowns from './components/Countdowns.jsx';
import Habits from './components/Habits.jsx';
import Learning from './components/Learning.jsx';
import Notes from './components/Notes.jsx';
import Routines from './components/Routines.jsx';
import Stats from './components/Stats.jsx';
import Todos from './components/Todos.jsx';
import Upcoming from './components/Upcoming.jsx';
import Weather from './components/Weather.jsx';
import { usePersistentState, useNow } from './hooks.js';
import { quoteForDay } from './quotes.js';
import { toKey } from './dates.js';

function greeting(hour) {
  if (hour < 5) return 'Up late';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function App() {
  const now = useNow();
  const today = toKey(now);
  const [events, setEvents] = usePersistentState('events', []);
  const [todos, setTodos] = usePersistentState('todos', []);

  const dateLine = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const timeLine = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1>{greeting(now.getHours())}</h1>
          <p className="muted">{dateLine}</p>
        </div>
        <time className="clock" dateTime={now.toISOString()}>
          {timeLine}
        </time>
      </header>
      <p className="quote">“{quoteForDay(now)}”</p>

      <div className="layout">
        <div className="col col-main">
          <section className="card" aria-label="Weather">
            <Weather />
          </section>
          <section className="card" aria-label="Calendar">
            <Calendar events={events} setEvents={setEvents} />
          </section>
        </div>

        <div className="col col-side">
          <section className="card" aria-label="To do">
            <Todos todos={todos} setTodos={setTodos} today={today} />
          </section>
          <section className="card" aria-label="Next 7 days">
            <Upcoming events={events} todos={todos} today={today} />
          </section>
          <section className="card" aria-label="Countdowns">
            <Countdowns today={today} />
          </section>
          <section className="card" aria-label="Habits">
            <Habits today={today} />
          </section>
          <section className="card" aria-label="Quick notes">
            <Notes />
          </section>
          <section className="card" aria-label="Bookmarks">
            <Bookmarks />
          </section>
          <section className="card" aria-label="Learning">
            <Learning />
          </section>
          <section className="card" aria-label="Routines">
            <Routines />
          </section>
          <section className="card" aria-label="Completed this week">
            <Stats todos={todos} today={today} />
          </section>
        </div>
      </div>
    </div>
  );
}
