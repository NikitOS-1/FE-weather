import type { AnyAction } from '@reduxjs/toolkit';

jest.mock('../../services/weather/weatherService', () => ({
  fetchCitySuggestions: jest.fn(),
  __esModule: true,
}));

import reducer, {
  clearSuggestions,
  fetchCitySuggestions,
} from '../../store/slices/citySearchSlice';

describe('citySearchSlice', () => {
  const initialState = {
    suggestions: [],
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, {} as AnyAction)).toEqual(initialState);
  });

  it('should handle clearSuggestions', () => {
    const state = {
      ...initialState,
      suggestions: [{ name: 'Kyiv', country: 'UA', lat: 50.45, lon: 30.52 }],
    };
    const nextState = reducer(state, clearSuggestions());
    expect(nextState.suggestions).toEqual([]);
  });

  it('should handle fetchCitySuggestions.pending', () => {
    const action = { type: fetchCitySuggestions.pending.type };
    const nextState = reducer(initialState, action);
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('should handle fetchCitySuggestions.fulfilled', () => {
    const payload = [
      { name: 'Kyiv', country: 'UA', lat: 50.45, lon: 30.52 },
      { name: 'London', country: 'GB', lat: 51.51, lon: -0.13 },
    ];
    const action = { type: fetchCitySuggestions.fulfilled.type, payload };
    const nextState = reducer(initialState, action);
    expect(nextState.suggestions).toEqual(payload);
    expect(nextState.loading).toBe(false);
  });

  it('should handle fetchCitySuggestions.rejected', () => {
    const action = {
      type: fetchCitySuggestions.rejected.type,
      payload: 'Some error',
    };
    const nextState = reducer(initialState, action);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe('Some error');
  });
});
