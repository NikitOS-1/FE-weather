import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { fetchCityDetails } from "@/features/weather/weatherThunks";
// import { selectCityDetails } from "@/features/weather/weatherSlice";
import { Line } from 'react-chartjs-2';
import './CityPage.scss';
import { useAppSelector } from '../../helpers/useAppSelector';
import { useAppDispatch } from '../../helpers/useAppDispatch';
import { addCity } from '../../store/slices/weatherSlice';
import type { WeatherData } from '../../commons/interfaces';

const CityPage = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const savedCities = useAppSelector((state) => state.city.cities);
  // const { current, hourly, loading, error } = useAppSelector((state) =>
  // selectCityDetails(state, cityName ?? ''),
  // );

  const { current, hourly, loading, error } = useAppSelector((state) => state.weather.cityDetails);
  useEffect(() => {
    savedCities.forEach((city: WeatherData) => {
      dispatch(addCity(city.name));
    });
  }, []);

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!current) return null;

  const chartData = {
    labels: hourly.map((h:any) =>
      new Date(h.dt * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    ),
    datasets: [
      {
        label: '°C',
        data: hourly.map((h: any) => h.temp),
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  } as const;

  return (
    <div className="city-page">
      <button className="back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1 className="city-page__title">{current.name}</h1>

      <div className="city-page__current">
        <img
          src={`https://openweathermap.org/img/wn/${current.weather[0].icon}@4x.png`}
          alt={current.weather[0].description}
        />
        <div className="city-page__temp">{Math.round(current.main.temp)}°C</div>
        <div className="city-page__description">{current.weather[0].description}</div>
        <div className="city-page__meta">
          <span>Humidity: {current.main.humidity}%</span>
          <span>Wind: {current.wind.speed} m/s</span>
        </div>
      </div>

      <section className="city-page__chart">
        <h2>Hourly forecast</h2>
        <div className="chart-wrapper">
          <Line data={chartData} options={chartOptions} />
        </div>
      </section>
    </div>
  );
};

export default CityPage;
