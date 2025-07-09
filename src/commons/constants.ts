export const WEATHER_API = {
  API_KEY: getApiKey(),
  BASE_URL: 'https://api.openweathermap.org',
};

function getApiKey() {
  return typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_API_WEATHER_APP_ID
    : process.env.VITE_API_WEATHER_APP_ID;
}

export const STORAGE = {
  KEY: 'weather_cities',
};

export const WEATHER_ICONS: Record<string, string> = {
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

export function getWeatherIcon(code: string): string {
  return WEATHER_ICONS[code] || '_❔_';
}
