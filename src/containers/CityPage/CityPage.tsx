import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getWeatherByCity } from '../../store/slices/weatherSlice';
import weatherService from '../../services/weather/weatherService';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './CityPage.scss';
import { useAppDispatch } from '../../helpers/useAppDispatch';
import { useAppSelector } from '../../helpers/useAppSelector';

const CityPage = () => {
  const { cityKey } = useParams<{ cityKey: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const weather = useAppSelector((state) => state.weather.weatherByCity[cityKey ?? '']);
  const [hourly, setHourly] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!weather && cityKey) {
      dispatch(getWeatherByCity(cityKey));
    }
  }, [cityKey, weather, dispatch]);

  useEffect(() => {
    const fetchHourly = async () => {
      if (weather?.lat && weather?.lon) {
        setLoading(true);
        try {
          const data = await weatherService.getHourlyWeatherByCoords({
            lat: weather.lat,
            lon: weather.lon,
          });
          setHourly(data.list.slice(0, 12));
        } catch (e: any) {
          setError('Failed to load hourly forecast');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchHourly();
  }, [weather]);

  if (!weather) return <div className="city-page__loader">Loading...</div>;
  if (error) return <div className="city-page__error">{error}</div>;

  const chartData = {
    labels: hourly.map((h) =>
      new Date(h.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ),
    datasets: [
      {
        label: 'Temperature, °C',
        data: hourly.map((h) => h.main.temp),
        borderColor: '#139279',
        backgroundColor: 'rgba(19,146,121,0.1)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: false },
    },
  } as const;

  return (
    <div className="city-page">
      <button className="city-page__back" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h1 className="city-page__title">{weather.name}</h1>
      <div className="city-page__current">
        <img
          className="city-page__icon"
          src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
          alt={weather.description}
        />
        <div className="city-page__temp">{Math.round(weather.temperature)}°C</div>
        <div className="city-page__description">{weather.description}</div>
        <div className="city-page__meta">
          <span>Humidity: {weather.humidity}%</span>
          <span>Wind: {weather.windSpeed} m/s</span>
          <span>Pressure: {weather.pressure} hPa</span>
        </div>
      </div>
      <section className="city-page__chart-section">
        <h2>Hourly Forecast</h2>
        <div className="city-page__chart-wrapper">
          <Line data={chartData} options={chartOptions} />
        </div>
      </section>
    </div>
  );
};

export default CityPage;
