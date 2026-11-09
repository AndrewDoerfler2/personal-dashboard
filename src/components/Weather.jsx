import { useEffect, useState } from 'react';
import { usePersistentState } from '../hooks.js';
import { parseKey } from '../dates.js';

// Open-Meteo: free, no API key. Temperatures in °F and wind in mph, to match the US default.
const DEFAULT_PLACE = { name: 'New York, NY', lat: 40.7128, lon: -74.006 };

// WMO weather codes → [emoji, label]
const CODES = {
  0: ['☀️', 'Clear'],
  1: ['🌤️', 'Mostly clear'],
  2: ['⛅', 'Partly cloudy'],
  3: ['☁️', 'Overcast'],
  45: ['🌫️', 'Fog'],
  48: ['🌫️', 'Icy fog'],
  51: ['🌦️', 'Light drizzle'],
  53: ['🌦️', 'Drizzle'],
  55: ['🌦️', 'Heavy drizzle'],
  56: ['🌧️', 'Freezing drizzle'],
  57: ['🌧️', 'Freezing drizzle'],
  61: ['🌧️', 'Light rain'],
  63: ['🌧️', 'Rain'],
  65: ['🌧️', 'Heavy rain'],
  66: ['🌧️', 'Freezing rain'],
  67: ['🌧️', 'Freezing rain'],
  71: ['🌨️', 'Light snow'],
  73: ['🌨️', 'Snow'],
  75: ['❄️', 'Heavy snow'],
  77: ['🌨️', 'Snow grains'],
  80: ['🌦️', 'Light showers'],
  81: ['🌧️', 'Showers'],
  82: ['⛈️', 'Heavy showers'],
  85: ['🌨️', 'Snow showers'],
  86: ['🌨️', 'Heavy snow showers'],
  95: ['⛈️', 'Thunderstorm'],
  96: ['⛈️', 'Thunderstorm, hail'],
  99: ['⛈️', 'Thunderstorm, hail'],
};

const describe = (code) => CODES[code] ?? ['🌡️', 'Unknown'];

export default function Weather() {
  const [place, setPlace] = usePersistentState('weatherPlace', DEFAULT_PLACE);
  const [forecast, setForecast] = useState(null);
  const [status, setStatus] = useState('loading');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    const params = new URLSearchParams({
      latitude: place.lat,
      longitude: place.lon,
      current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min',
      temperature_unit: 'fahrenheit',
      wind_speed_unit: 'mph',
      timezone: 'auto',
      forecast_days: '5',
    });
    fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Weather service returned ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setForecast(json);
        setStatus('ready');
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setStatus('error');
      });
    return () => controller.abort();
  }, [place.lat, place.lon]);

  const findPlace = async (e) => {
    e.preventDefault();
    const name = query.trim();
    if (!name) return;
    setMessage(null);
    try {
      const params = new URLSearchParams({ name, count: '1', language: 'en', format: 'json' });
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
      const json = await res.json();
      const hit = json.results?.[0];
      if (!hit) {
        setMessage(`No place found for “${name}”.`);
        return;
      }
      setPlace({
        name: [hit.name, hit.admin1, hit.country_code].filter(Boolean).join(', '),
        lat: hit.latitude,
        lon: hit.longitude,
      });
      setQuery('');
    } catch {
      setMessage('Could not look up that place. Check your connection.');
    }
  };

  const useMyLocation = () => {
    setMessage(null);
    if (!navigator.geolocation) {
      setMessage('This browser cannot share its location.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setPlace({
          name: 'My location',
          lat: Number(pos.coords.latitude.toFixed(4)),
          lon: Number(pos.coords.longitude.toFixed(4)),
        }),
      () => setMessage('Location permission was denied.'),
      { timeout: 10_000 },
    );
  };

  const current = forecast?.current;
  const [icon, label] = describe(current?.weather_code);

  return (
    <>
      <div className="card-head">
        <h2>Weather</h2>
        <span className="muted small">{place.name}</span>
      </div>

      {status === 'loading' && !forecast && <p className="muted">Loading forecast…</p>}
      {status === 'error' && <p className="error">Couldn’t load the forecast. Try again later.</p>}

      {forecast && current && (
        <div className="weather-body">
          <div className="now">
            <span className="big-icon" aria-hidden="true">{icon}</span>
            <div>
              <div className="temp">{Math.round(current.temperature_2m)}°F</div>
              <div className="muted">
                {label} · feels like {Math.round(current.apparent_temperature)}°
              </div>
              <div className="muted small">
                Humidity {current.relative_humidity_2m}% · Wind {Math.round(current.wind_speed_10m)} mph
              </div>
            </div>
          </div>

          <ol className="forecast">
            {forecast.daily.time.map((day, i) => {
              const [dayIcon] = describe(forecast.daily.weather_code[i]);
              return (
                <li key={day}>
                  <span>{i === 0 ? 'Today' : parseKey(day).toLocaleDateString(undefined, { weekday: 'short' })}</span>
                  <span aria-hidden="true">{dayIcon}</span>
                  <span>
                    <strong>{Math.round(forecast.daily.temperature_2m_max[i])}°</strong>
                    <span className="muted"> {Math.round(forecast.daily.temperature_2m_min[i])}°</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <form className="row place-form" onSubmit={findPlace}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Change city…"
          aria-label="Change city"
        />
        <button type="submit">Set</button>
        <button type="button" onClick={useMyLocation}>
          Use my location
        </button>
      </form>
      {message && <p className="error small">{message}</p>}
    </>
  );
}
