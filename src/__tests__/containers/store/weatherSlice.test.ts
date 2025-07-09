import { AnyAction } from '@reduxjs/toolkit';

jest.mock('../../../commons/constants', () => ({
  WEATHER_API: {
    API_KEY: 'test-key',
    BASE_URL: 'https://api.openweathermap.org',
  },
  STORAGE: { KEY: 'weather_cities' },
  getWeatherIcon: () => '☀️',
  __esModule: true,
}));

jest.mock('../../../services/localStorage/localStorageService', () => ({
  __esModule: true,
  default: {
    save: jest.fn(),
    load: jest.fn(() => []),
    clear: jest.fn(),
  },
}));

jest.mock('../../../services/weather/weatherService', () => ({
  getWeatherByCityName: jest.fn(),
  __esModule: true,
}));

import reducer, { removeCity, getWeatherByCity } from '../../../store/slices/weatherSlice';

describe('weatherSlice', () => {
  const initialState = {
    cityNames: [],
    weatherByCity: {},
    loading: false,
    loadingByCity: {},
    error: null,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, {} as AnyAction)).toEqual(initialState);
  });

  it('should handle removeCity', () => {
    const state = {
      ...initialState,
      cityNames: ['Kyiv', 'London'],
      weatherByCity: { Kyiv: { temp: 1 }, London: { temp: 2 } } as any,
    };
    const nextState = reducer(state, removeCity('Kyiv'));
    expect(nextState.cityNames).toEqual(['London']);
    expect(nextState.weatherByCity).toEqual({ London: { temp: 2 } });
  });

  it('should handle getWeatherByCity.pending', () => {
    const action = { type: getWeatherByCity.pending.type, meta: { arg: 'Kyiv' } };
    const nextState = reducer(initialState, action);
    expect(nextState.loading).toBe(true);
    expect(nextState.loadingByCity['Kyiv']).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('should handle getWeatherByCity.fulfilled', () => {
    const payload = {
      id: 1,
      name: 'Kyiv',
      country: 'UA',
      state: '',
      temperature: 10,
      description: 'clear',
      icon: '01d',
      humidity: 50,
      windSpeed: 2,
      pressure: 1012,
      updatedAt: 123456,
      lat: 1,
      lon: 2,
    };
    const action = { type: getWeatherByCity.fulfilled.type, payload };
    const prevState = { ...initialState, cityNames: [] };
    const nextState = reducer(prevState, action);
    expect(nextState.loading).toBe(false);
    expect(nextState.loadingByCity['Kyiv']).toBe(false);
    expect(nextState.cityNames).toContain('Kyiv');
    expect(nextState.weatherByCity['Kyiv']).toEqual(payload);
  });

  it('should handle getWeatherByCity.rejected', () => {
    const action = {
      type: getWeatherByCity.rejected.type,
      meta: { arg: 'Kyiv' },
      payload: 'Some error',
    };
    const nextState = reducer(initialState, action);
    expect(nextState.loading).toBe(false);
    expect(nextState.loadingByCity['Kyiv']).toBe(false);
    expect(nextState.error).toBe('Some error');
  });
});
