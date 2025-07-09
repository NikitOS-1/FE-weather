import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './slices/weatherSlice';
import citySearchReducer from './slices/citySearchSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    citySearch: citySearchReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
