import { useEffect } from 'react';
import './HomePage.scss';
import { WeatherCard } from '../../components/WeatherCard/WeatherCard';
import { useNavigate } from 'react-router-dom';
import { getWeatherByCity, removeCity } from '../../store/slices/weatherSlice';
import { CitySearchDropdown } from '../../components/CitySearchDropdown/CitySearchDropdown';
import { useAppDispatch } from '../../helpers/useAppDispatch';
import { useAppSelector } from '../../helpers/useAppSelector';

export const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cityNames = useAppSelector((state) => state.weather.cityNames);
  const weatherByCity = useAppSelector((state) => state.weather.weatherByCity);

  useEffect(() => {
    cityNames.forEach((city: string) => {
      dispatch(getWeatherByCity(city));
    });
  }, [dispatch]);

  const handleRefresh = (city: string) => {
    dispatch(getWeatherByCity(city));
  };

  const handleDelete = (city: string) => {
    dispatch(removeCity(city));
  };

  return (
    <main className="home-page">
      <section className="home-page__search">
        <CitySearchDropdown />
      </section>
      <section className="home-page__weather-list">
        {cityNames.length === 0 && (
          <p className="home-page__empty-message">
            No cities added yet. Please add some cities to see their weather.
          </p>
        )}
        {cityNames.map((city) => {
          const weather = weatherByCity[city];
          if (!weather) return null;
          return (
            <WeatherCard
              key={weather.id}
              city={weather.name}
              state={weather.state || ''}
              country={weather.country}
              icon={weather.icon}
              updatedAt={weather.updatedAt}
              temperature={weather.temperature}
              description={weather.description}
              onClick={() => navigate(`/${weather.name}`)}
              onRefresh={() => handleRefresh(city)}
              onDelete={() => handleDelete(city)}
            />
          );
        })}
      </section>
    </main>
  );
};
