import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { clearSuggestions, fetchCitySuggestions } from '../../store/slices/citySearchSlice';
import { getWeatherByCity } from '../../store/slices/weatherSlice';
import { useAppDispatch } from '../../helpers/useAppDispatch';
import { useAppSelector } from '../../helpers/useAppSelector';
import './CitySearchDropdown.scss';
import { debounce } from '../../helpers/debounce';
import { CitySuggestionItem } from './CitySuggestionItem';

const SEARCH_DEBOUNCE_DELAY = 400;
const ERROR_DISPLAY_DURATION = 3600;

export const CitySearchDropdown: React.FC = () => {
  const [input, setInput] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { suggestions } = useAppSelector((state) => state.citySearch);
  const cityNames = useAppSelector((state) => state.weather.cityNames);
  const error = useAppSelector((state) => state.weather.error);

  const debouncedFetchSuggestions = useMemo(
    () =>
      debounce((value: string) => {
        if (value.length >= 2) {
          dispatch(fetchCitySuggestions(value));
          setSuggestionsVisible(true);
        }
      }, SEARCH_DEBOUNCE_DELAY),
    [dispatch],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSuggestionsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (input.length >= 2) {
      debouncedFetchSuggestions(input);
    } else {
      dispatch(clearSuggestions());
      setSuggestionsVisible(false);
    }

    return () => {
      debouncedFetchSuggestions.cancel?.();
    };
  }, [input, debouncedFetchSuggestions, dispatch]);

  useEffect(() => {
    if (error) {
      setErrorVisible(true);
      setNotificationMessage('City not found');

      const timer = setTimeout(() => {
        setErrorVisible(false);
      }, ERROR_DISPLAY_DURATION);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleAddCity = useCallback(
    (name: string) => {
      if (cityNames.includes(name)) {
        setNotificationMessage('City already exists');
        setErrorVisible(true);

        const timer = setTimeout(() => {
          setErrorVisible(false);
        }, ERROR_DISPLAY_DURATION);

        return () => clearTimeout(timer);
      }

      dispatch(getWeatherByCity(name));
      setInput('');
      setSuggestionsVisible(false);
      dispatch(clearSuggestions());
    },
    [cityNames, dispatch],
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setErrorVisible(false);
  }, []);

  const handleInputFocus = useCallback(() => {
    if (input.length >= 2 && suggestions.length > 0) {
      setSuggestionsVisible(true);
    }
  }, [input, suggestions]);

  return (
    <div className="city-search-dropdown" ref={dropdownRef}>
      {errorVisible && (
        <div
          className={`city-search-dropdown__error city-search-dropdown__error--floating`}
          role="alert"
        >
          <p>{notificationMessage}</p>
        </div>
      )}

      <input
        type="text"
        placeholder="Enter the city name..."
        value={input}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        className="city-search-dropdown__input"
        aria-label="Search for a city"
      />

      {suggestionsVisible && suggestions.length > 0 && (
        <ul className="city-search-dropdown__suggestions" aria-live="polite">
          {suggestions.map((city, i) => (
            <CitySuggestionItem key={`${city.name}-${i}`} city={city} onAddCity={handleAddCity} />
          ))}
        </ul>
      )}
    </div>
  );
};