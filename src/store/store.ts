import { configureStore } from '@reduxjs/toolkit';
import localStorageService from '../services/localStorage/localStorageService';
import weatherReducer from './slices/weatherSlice';
import citySearchReducer from './slices/citySearchSlice';

const preloadedCityNames = localStorageService.load();

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    citySearch: citySearchReducer,
  },
  preloadedState: {
    weather: {
      cityNames: preloadedCityNames,
      weatherByCity: {},
      loading: true,
      error: null,
    },
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
