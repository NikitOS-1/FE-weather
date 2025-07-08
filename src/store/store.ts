import { configureStore } from '@reduxjs/toolkit';
import localStorageService from '../services/localStorage/localStorageService';
import weatherReducer from './slices/weatherSlice';

const preloadedCityNames = localStorageService.load();

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
  preloadedState: {
    weather: {
      cityNames: preloadedCityNames,
      weatherByCity: {},
      loading: false,
      error: null,
    },
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
