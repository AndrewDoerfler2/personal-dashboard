// Dashboard layout: weather across the top, calendar and to-do list below.
import Calendar from './components/Calendar.jsx';
import Todos from './components/Todos.jsx';
import Weather from './components/Weather.jsx';
import { useNow } from './hooks.js';

function greeting(hour) {
  if (hour < 5) return 'Up late';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function App() {
  const now = useNow();
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

      <div className="grid">
        <section className="card weather-card" aria-label="Weather">
          <Weather />
        </section>
        <section className="card calendar-card" aria-label="Calendar">
          <Calendar />
        </section>
        <section className="card todo-card" aria-label="To do">
          <Todos />
        </section>
      </div>
    </div>
  );
}
