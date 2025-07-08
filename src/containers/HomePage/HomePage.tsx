import { useCallback, useEffect, useState } from 'react';
import { WeatherCard } from '../../components/WeatherCard/WeatherCard';
import './HomePage.scss';
import { useNavigate } from 'react-router-dom';
import { getWeatherByCity, removeCity } from '../../store/slices/weatherSlice';
import { debounce } from '../../helpers/debounce';
import { CitySearchDropdown } from '../../components/CitySearchDropdown/CitySearchDropdown';
import { useAppDispatch } from '../../helpers/useAppDispatch';
import { useAppSelector } from '../../helpers/useAppSelector';

const DELAY_SEARCH_INTERVAL = 1000;
const MIN_SEARCH_LENGTH = 1;

export const HomePage = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cityNames = useAppSelector((state) => state.weather.cityNames);
  const weatherByCity = useAppSelector((state) => state.weather.weatherByCity);

  const handleRefresh = (city: string) => {
    dispatch(getWeatherByCity(city));
  };

  const handleDelete = (city: string) => {
    dispatch(removeCity(city));
  };

  const debounceSearch = useCallback(
    debounce((searchCity: string) => {
      if (searchCity.length > MIN_SEARCH_LENGTH) {
        dispatch(getWeatherByCity(searchCity));
      }
    }, DELAY_SEARCH_INTERVAL),
    [dispatch],
  );

  useEffect(() => {
    cityNames.forEach((city) => {
      dispatch(getWeatherByCity(city));
    });
  }, [dispatch, cityNames, debounceSearch, searchValue]);

  const filteredCities = cityNames.filter((name) =>
    name.toLowerCase().includes(searchValue.toLowerCase()),
  );

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
        {filteredCities.map((city) => {
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
