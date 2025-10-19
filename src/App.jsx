import { useEffect, useState } from 'react';
import './index.css';

const API_KEY = '9875a91715ee6629708f052f63a8ed9f'; // Replace with your OpenWeatherMap key

function App() {
  const [city, setCity] = useState('New York');
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState('metric'); // 'metric' or 'imperial'
  const [error, setError] = useState(null);
  const [bg, setBg] = useState('from-blue-300 to-blue-600');

  const fetchWeather = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('City not found');
      const data = await res.json();
      setWeather(data);
      setError(null);
      updateBackground(data.weather[0].main.toLowerCase());
    } catch (err) {
      setWeather(null);
      setError(err.message);
    }
  };

  const searchByCity = (e) => {
    e.preventDefault();
    if (query.trim() !== '') {
      setCity(query);
      setQuery('');
    }
  };

  const handleUnitToggle = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  const getWeatherByLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${unit}`
        );
      },
      () => setError('Failed to get location')
    );
  };

  const updateBackground = (condition) => {
    const bgMap = {
      clear: 'from-yellow-300 to-orange-500',
      clouds: 'from-gray-400 to-gray-600',
      rain: 'from-blue-700 to-gray-800',
      drizzle: 'from-blue-400 to-blue-700',
      thunderstorm: 'from-gray-700 to-black',
      snow: 'from-blue-100 to-white',
      mist: 'from-gray-300 to-gray-500',
    };
    setBg(bgMap[condition] || 'from-blue-300 to-blue-600');
  };

  useEffect(() => {
    fetchWeather(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
    );
  }, [city, unit]);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br ${bg} text-white p-4 transition-all`}>
      <h1 className="text-4xl font-bold mb-4">Weather App 🌦️</h1>

      <form onSubmit={searchByCity} className="flex gap-2 mb-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter city"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow p-3 rounded-xl text-black"
        />
        <button type="submit" className="bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold">
          Search
        </button>
      </form>

      <div className="flex gap-4 mb-6">
        <button
          onClick={getWeatherByLocation}
          className="bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold"
        >
          📍 My Location
        </button>
        <button
          onClick={handleUnitToggle}
          className="bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold"
        >
          °C / °F
        </button>
      </div>

      {error && <p className="text-red-100 mb-4">{error}</p>}

      {weather && (
        <div className="bg-white text-gray-800 rounded-2xl shadow-xl p-6 w-80 text-center">
          <h2 className="text-2xl font-bold">{weather.name}</h2>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="icon"
            className="mx-auto"
          />
          <p className="text-3xl font-semibold">
            {weather.main.temp}° {unit === 'metric' ? 'C' : 'F'}
          </p>
          <p className="capitalize text-gray-600">{weather.weather[0].description}</p>
          <p className="text-sm mt-2">Humidity: {weather.main.humidity}%</p>
          <p className="text-sm">Wind: {weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
        </div>
      )}
    </div>
  );
}

export default App;