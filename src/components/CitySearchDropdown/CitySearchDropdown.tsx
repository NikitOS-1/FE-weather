import { useEffect, useState, useCallback } from 'react';
import { clearSuggestions, fetchCitySuggestions } from '../../store/slices/citySearchSlice';
import { getWeatherByCity } from '../../store/slices/weatherSlice';
import { useAppDispatch } from '../../helpers/useAppDispatch';
import { useAppSelector } from '../../helpers/useAppSelector';
import './CitySearchDropdown.scss';
import { debounce } from '../../helpers/debounce';

const SEARCH_DEBOUNCE_DELAY = 400;

export const CitySearchDropdown = () => {
  const [input, setInput] = useState('');
  const [showError, setShowError] = useState(false);
  const [showMessage, setShowMessage] = useState<string>('');
  const [hideError, setHideError] = useState(false);
  const dispatch = useAppDispatch();
  const { suggestions } = useAppSelector((state) => state.citySearch);
  const cityNames = useAppSelector((state) => state.weather.cityNames);
  const errors = useAppSelector((state) => state.weather.error);

  const debouncedFetchSuggestions = useCallback(
    debounce((value: string) => {
      if (value.length >= 2) {
        dispatch(fetchCitySuggestions(value));
      }
    }, SEARCH_DEBOUNCE_DELAY),
    [dispatch],
  );

  useEffect(() => {
    if (input.length >= 2) {
      debouncedFetchSuggestions(input);
    } else {
      dispatch(clearSuggestions());
    }

    return () => {
      debouncedFetchSuggestions.cancel?.();
    };
  }, [input, debouncedFetchSuggestions, dispatch]);

  useEffect(() => {
    if (errors) {
      setShowError(true);
      setHideError(false);
      const timer = setTimeout(() => setHideError(true), 3200);
      const timer2 = setTimeout(() => setShowError(false), 3600);
      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
      };
    }
  }, [errors]);

  const handleAddCity = (name: string) => {
    if (cityNames.includes(name)) {
      setShowMessage('City already exists');
    }
    dispatch(getWeatherByCity(name));
    setInput('');
    dispatch(clearSuggestions());
  };

  return (
    <div className="city-search-dropdown">
      {showError && errors && (
        <div
          className={
            `city-search-dropdown__error city-search-dropdown__error--floating` +
            (hideError ? ' city-search-dropdown__error--hide' : '')
          }
        >
          <p>{showMessage && 'City not found'}</p>
        </div>
      )}
      <input
        type="text"
        placeholder="Enter the city name..."
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
