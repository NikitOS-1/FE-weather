import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { getWeatherByCity } from '../../store/slices/weatherSlice';
import weatherService from '../../services/weather/weatherService';
import { useAppDispatch } from '../../helpers/useAppDispatch';
import { useAppSelector } from '../../helpers/useAppSelector';
import './CityPage.scss';
import type { HourlyForecast } from '../../commons/interfaces';

const MAX_HOURLY_FORECASTS = 12;

export const CityPage: React.FC = () => {
  const { cityKey } = useParams<{ cityKey: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const weather = useAppSelector((state) =>
    cityKey ? state.weather.weatherByCity[cityKey] : null,
  );

  const [hourlyForecasts, setHourlyForecasts] = useState<HourlyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!weather && cityKey) {
      dispatch(getWeatherByCity(cityKey));
    }
  }, [cityKey, weather, dispatch]);

  useEffect(() => {
    const fetchHourlyForecast = async () => {
      if (!weather?.lat || !weather?.lon) return;

      setLoading(true);
      setError(null);

      try {
        const data = await weatherService.getHourlyWeatherByCoords({
          lat: weather.lat,
          lon: weather.lon,
        });
        setHourlyForecasts(data.list.slice(0, MAX_HOURLY_FORECASTS));
      } catch (err) {
        console.error('Failed to load hourly forecast:', err);
        setError('Failed to load hourly forecast data');
      } finally {
        setLoading(false);
      }
    };

    fetchHourlyForecast();
  }, [weather]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const chartData = useMemo(
    () => ({
      labels: hourlyForecasts.map((h) =>
        new Date(h.dt * 1000).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      ),
      datasets: [
        {
          label: 'Temperature, °C',
          data: hourlyForecasts.map((h) => h.main.temp),
          borderColor: '#139279',
          backgroundColor: 'rgba(19,146,121,0.1)',
          tension: 0.4,
          borderWidth: 2,
        },
      ],
    }),
    [hourlyForecasts],
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    }),
    [],
  );

  if (!weather) {
    return (
      <div className="city-page__loader">
        <div className="spinner" aria-label="Loading weather data" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="city-page__error">
        <p>{error}</p>
        <button onClick={handleGoBack}>Go back</button>
      </div>
    );
  }

  return (
    <div className="city-page">
      <button
        className="city-page__back"
        onClick={handleGoBack}
        aria-label="Go back to previous page"
      >
        ← Back
      </button>

      <h1 className="city-page__title" aria-label={`Weather in ${weather.name}`}>
        {weather.name}
      </h1>

      <div className="city-page__current">
        <img
          className="city-page__icon"
          src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
          alt={weather.description}
          loading="lazy"
        />
        <div className="city-page__temp">{Math.round(weather.temperature)}°C</div>
        <div className="city-page__description">{weather.description}</div>
        <div className="city-page__meta">
          <span>Humidity: {weather.humidity}%</span>
          <span>Wind: {weather.windSpeed} m/s</span>
          <span>Pressure: {weather.pressure} hPa</span>
        </div>
      </div>

      <section className="city-page__chart-section" aria-label="Hourly temperature forecast">
        <h2>Hourly Forecast</h2>
        {loading ? (
          <div className="chart-loading">Loading chart...</div>
        ) : (
          <div className="city-page__chart-wrapper">
            <Line data={chartData} options={chartOptions} aria-label="Temperature chart" />
          </div>
        )}
      </section>
    </div>
  );
};

export default CityPage;
