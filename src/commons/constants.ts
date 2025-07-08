export const WEATHER_API = {
  API_KEY: import.meta.env.VITE_API_WEATHER_APP_ID,
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
};

export const STORAGE = {
  KEY: 'weather_cities',
};

export const WEATHER_ICONS = {
  '01d': '☀️',
  '01n': '🌙',
  '02d': '🌤️',
  '02n': '🌥️',
  '03d': '☁️',
  '03n': '☁️',
  '04d': '☁️',
  '04n': '☁️',
  '09d': '🌧️',
  '09n': '🌧️',
  '10d': '🌦️',
  '10n': '🌦️',
  '11d': '⛈️',
  '11n': '⛈️',
  '13d': '❄️',
  '13n': '❄️',
  '50d': '🌫️',
  '50n': '🌫️',
};
