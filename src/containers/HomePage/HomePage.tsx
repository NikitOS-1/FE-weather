import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWeatherByCity, removeCity } from '../../store/slices/weatherSlice';
import { CitySearchDropdown } from '../../components/CitySearchDropdown/CitySearchDropdown';
import { WeatherCard } from '../../components/WeatherCard/WeatherCard';
import { useAppDispatch } from '../../helpers/useAppDispatch';
import { useAppSelector } from '../../helpers/useAppSelector';
import './HomePage.scss';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cityNames = useAppSelector((state) => state.weather.cityNames);
  const weatherByCity = useAppSelector((state) => state.weather.weatherByCity);
  const loading = useAppSelector((state) => state.weather.loading);

  useEffect(() => {
    if (cityNames.length > 0) {
      cityNames.forEach((city) => {
        dispatch(getWeatherByCity(city));
      });
    }
  }, [dispatch, cityNames]);

  const handleRefresh = useCallback(
    (city: string) => {
      dispatch(getWeatherByCity(city));
    },
    [dispatch],
  );

  const handleDelete = useCallback(
    (city: string) => {
      dispatch(removeCity(city));
    },
    [dispatch],
  );

  const handleCardClick = useCallback(
    (city: string) => {
      navigate(`/${city}`);
    },
    [navigate],
  );

  const renderWeatherCards = useCallback(() => {
    return cityNames.map((city) => {
      const weather = weatherByCity[city];
      if (!weather) return null;

      return (
        <WeatherCard
          key={`${weather.id}-${city}`}
          city={weather.name}
          state={weather.state || ''}
          country={weather.country}
          icon={weather.icon}
          updatedAt={weather.updatedAt}
          temperature={weather.temperature}
          description={weather.description}
          onClick={() => handleCardClick(city)}
          onRefresh={() => handleRefresh(city)}
          onDelete={() => handleDelete(city)}
        />
      );
    });
  }, [cityNames, weatherByCity, handleCardClick, handleRefresh, handleDelete]);

  return (
    <main className="home-page" aria-busy={loading}>
      <section className="home-page__search">
        <CitySearchDropdown />
      </section>
      {cityNames.length === 0 && (
        <p className="home-page__empty-message">
          No cities added yet. Please add some cities to see their weather. 😊
        </p>
      )}
      <section className="home-page__weather-list">{renderWeatherCards()}</section>
    </main>
  );
};
