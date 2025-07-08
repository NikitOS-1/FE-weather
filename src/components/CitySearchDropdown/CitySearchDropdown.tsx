import { useEffect, useState } from 'react';
import { clearSuggestions, fetchCitySuggestions } from '../../store/slices/citySearchSlice';
import { addCity, getWeatherByCity } from '../../store/slices/weatherSlice';
import { useAppDispatch } from '../../helpers/useAppDispatch';
import { useAppSelector } from '../../helpers/useAppSelector';
import './CitySearchDropdown.scss';

export const CitySearchDropdown = () => {
  const [input, setInput] = useState('');
  const dispatch = useAppDispatch();
  const { suggestions } = useAppSelector((state) => state.citySearch);
  const cityNames = useAppSelector((state) => state.weather.cityNames);
  // const isLoading = useAppSelector((state) => state.citySearch.loading);

  useEffect(() => {
    if (input.length >= 2) {
      dispatch(fetchCitySuggestions(input));
    } else {
      dispatch(clearSuggestions());
    }
  }, [input, dispatch]);

  const handleAddCity = (name: string) => {
    if (!cityNames.includes(name)) {
      dispatch(addCity(name));
      dispatch(getWeatherByCity(name));
    }
    setInput('');
    dispatch(clearSuggestions());
  };

  return (
    <div className="city-search-dropdown">
      <input
        type="text"
        placeholder="Введіть назву міста..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="city-search-dropdown__input"
      />
      {suggestions.length > 0 && (
        <ul className="city-search-dropdown__suggestions">
          {suggestions.map((city, i) => (
            <li
              key={`${city.name}-${i}`}
              className="city-search-dropdown__suggestion"
              onClick={() => handleAddCity(city.name)}
            >
              <span>
                {city.name}
                {city.state ? `, ${city.state}` : ''} ({city.country})
              </span>
              <button
                className="city-search-dropdown__suggestion-add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddCity(city.name);
                }}
              >
                ➕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
