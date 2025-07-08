import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { CitySuggestion } from '../../commons/interfaces';
import weatherService from '../../services/weather/weatherService';

interface CitySearchState {
  suggestions: CitySuggestion[];
  loading: boolean;
  error: string | null;
}

const initialState: CitySearchState = {
  suggestions: [],
  loading: false,
  error: null,
};

export const fetchCitySuggestions = createAsyncThunk<
  CitySuggestion[],
  string,
  { rejectValue: string }
>('citySearch/fetchCitySuggestions', async (query, { rejectWithValue }) => {
  try {
    return await weatherService.fetchCitySuggestions(query);
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Failed to fetch city suggestions');
  }
});

const citySearchSlice = createSlice({
  name: 'citySearch',
  initialState,
  reducers: {
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCitySuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCitySuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
        state.loading = false;
      })
      .addCase(fetchCitySuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Помилка';
      });
  },
});

export const { clearSuggestions } = citySearchSlice.actions;
export default citySearchSlice.reducer;
