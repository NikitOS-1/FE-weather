import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InputField } from '../../components/InputField/InputField';
import { WeatherCard } from '../../components/WeatherCard/WeatherCard';
import './HomePage.scss';
import { useNavigate } from 'react-router-dom';
import { addCity, getWeatherByCity, removeCity } from '../../store/slices/weatherSlice';
import type { RootState, AppDispatch } from '../../store/store';
import { debounce } from '../../helpers/debounce';

const DELAY_SEARCH_INTERVAL = 1000;
const MIN_SEARCH_LENGTH = 1;

export const HomePage = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const cityNames = useSelector((state: RootState) => state.weather.cityNames);
  const weatherByCity = useSelector((state: RootState) => state.weather.weatherByCity);

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
    debounceSearch(searchValue);
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
        <InputField
          className="home-page__search-input"
          placeholder="Search city"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </section>
      <section className="home-page__weather-list">
        {/* {cityNames.length === 0 && (
          <p className="home-page__empty-message">
            No cities added yet. Please add some cities to see their weather.
          </p>
        )} */}
        {filteredCities.map((city) => {
          const weather = weatherByCity[city];
          if (!weather) return null;
          return (
            <WeatherCard
              key={weather.id}
              city={weather.name}
              temperature={weather.temperature}
              description={weather.description}
              isAdded={cityNames.includes(weather.name)}
              onClick={() => navigate(`/${weather.name}`)}
              onRefresh={() => handleRefresh(city)}
              onDelete={() => handleDelete(city)}
              addCity={(cityName) => dispatch(addCity(cityName))}
            />
          );
        })}
      </section>
    </main>
  );
};
