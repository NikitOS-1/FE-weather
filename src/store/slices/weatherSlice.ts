import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { WeatherData } from '../../commons/interfaces';
import localStorageService from '../../services/localStorage/localStorageService';
import weatherService from '../../services/weather/weatherService';

export const getWeatherByCity = createAsyncThunk<WeatherData, string>(
  'weather/getWeatherByCity',
  async (cityName: string, { rejectWithValue }) => {
    try {
      const data = await weatherService.getWeatherByCityName(cityName);
      return {
        id: data.id,
        name: data.name,
        country: data.sys.country,
        state: data.sys.type ? data.sys.type.toString() : undefined,
        temperature: data.main.temp,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        updatedAt: Date.now(),
        lat: data.coord.lat,
        lon: data.coord.lon,
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch weather');
    }
  },
);

export const getWeatherForAllCities = createAsyncThunk<void, string[], { dispatch: any }>(
  'weather/getWeatherForAllCities',
  async (cities, { dispatch }) => {
    for (const city of cities) {
      await dispatch(getWeatherByCity(city));
    }
  },
);

interface WeatherState {
  cityNames: string[];
  weatherByCity: Record<string, WeatherData | null>;
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  cityNames: localStorageService.load(),
  weatherByCity: {},
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    addCity(state, action: PayloadAction<string>) {
      const city = action.payload.trim();
      if (!state.cityNames.includes(city)) {
        state.cityNames.push(city);
        state.weatherByCity[city] = null;
        localStorageService.save(state.cityNames);
      }
    },
    removeCity(state, action: PayloadAction<string>) {
      const city = action.payload;
      state.cityNames = state.cityNames.filter((name) => name !== city);
      delete state.weatherByCity[city];
      localStorageService.save(state.cityNames);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWeatherByCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWeatherByCity.fulfilled, (state, action) => {
        state.loading = false;
        const cityName = action.payload.name;
        if (!state.cityNames.includes(cityName)) {
          state.cityNames.push(cityName);
        }
        state.weatherByCity[cityName] = action.payload;
      })
      .addCase(getWeatherByCity.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch weather';
      });
  },
});

export const { addCity, removeCity } = weatherSlice.actions;
export default weatherSlice.reducer;
