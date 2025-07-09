import { configureStore } from '@reduxjs/toolkit';

jest.mock('../../../commons/constants', () => ({
  WEATHER_API: {
    API_KEY: 'test-key',
    BASE_URL: 'https://api.openweathermap.org',
  },
  STORAGE: { KEY: 'weather_cities' },
  getWeatherIcon: () => '☀️',
  __esModule: true,
}));

import weatherReducer from '../../../store/slices/weatherSlice';
import citySearchReducer from '../../../store/slices/citySearchSlice';

describe('Redux store', () => {
  it('should create store with weather and citySearch reducers', () => {
    const store = configureStore({
      reducer: {
        weather: weatherReducer,
        citySearch: citySearchReducer,
      },
    });

    const state = store.getState();
    expect(state).toHaveProperty('weather');
    expect(state).toHaveProperty('citySearch');
  });

  it('weather reducer should have initial state', () => {
    const store = configureStore({
      reducer: { weather: weatherReducer },
    });
    const state = store.getState().weather;
    expect(state).toHaveProperty('cityNames');
    expect(state).toHaveProperty('weatherByCity');
    expect(state).toHaveProperty('loading');
    expect(state).toHaveProperty('loadingByCity');
    expect(state).toHaveProperty('error');
  });

  it('citySearch reducer should have initial state', () => {
    const store = configureStore({
      reducer: { citySearch: citySearchReducer },
    });
    const state = store.getState().citySearch;
    expect(state).toHaveProperty('suggestions');
    expect(state).toHaveProperty('loading');
    expect(state).toHaveProperty('error');
  });
});
