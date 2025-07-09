import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HomePage } from '../../containers/HomePage/HomePage';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

const mockDispatch = jest.fn();
jest.mock('../../helpers/useAppDispatch', () => ({
  useAppDispatch: () => mockDispatch,
}));
jest.mock('../../helpers/useAppSelector', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('../../commons/constants', () => ({
  WEATHER_API: {
    API_KEY: 'test-key',
    BASE_URL: 'https://api.openweathermap.org',
  },
  STORAGE: { KEY: 'weather_cities' },
  getWeatherIcon: () => '☀️',
  __esModule: true,
}));

jest.mock('../../components/WeatherCard/WeatherCard', () => ({
  WeatherCard: ({ city, onClick, onRefresh, onDelete }: any) => (
    <div data-testid={`weather-card-${city}`}>
      <button onClick={onClick}>Open</button>
      <button onClick={onRefresh}>Refresh</button>
      <button onClick={onDelete}>Delete</button>
      {city}
    </div>
  ),
}));
jest.mock('../../components/CitySearchDropdown/CitySearchDropdown', () => ({
  CitySearchDropdown: () => <div data-testid="city-search-dropdown" />,
}));

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty message if no cities', () => {
    // @ts-ignore
    require('../../helpers/useAppSelector').useAppSelector.mockImplementation((fn: any) =>
      fn({
        weather: { cityNames: [], weatherByCity: {}, loading: false },
      }),
    );
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/No cities added yet/i)).toBeInTheDocument();
    expect(screen.getByTestId('city-search-dropdown')).toBeInTheDocument();
  });

  it('renders WeatherCard for each city', () => {
    // @ts-ignore
    require('../../helpers/useAppSelector').useAppSelector.mockImplementation((fn: any) =>
      fn({
        weather: {
          cityNames: ['Kyiv', 'London'],
          weatherByCity: {
            Kyiv: {
              id: 1,
              name: 'Kyiv',
              country: 'UA',
              icon: '01d',
              updatedAt: 1,
              temperature: 10,
              description: 'Clear',
            },
            London: {
              id: 2,
              name: 'London',
              country: 'GB',
              icon: '02d',
              updatedAt: 2,
              temperature: 12,
              description: 'Cloudy',
            },
          },
          loading: false,
        },
      }),
    );
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('weather-card-Kyiv')).toBeInTheDocument();
    expect(screen.getByTestId('weather-card-London')).toBeInTheDocument();
  });

  it('handles WeatherCard actions', () => {
    // @ts-ignore
    require('../../helpers/useAppSelector').useAppSelector.mockImplementation((fn: any) =>
      fn({
        weather: {
          cityNames: ['Kyiv'],
          weatherByCity: {
            Kyiv: {
              id: 1,
              name: 'Kyiv',
              country: 'UA',
              icon: '01d',
              updatedAt: 1,
              temperature: 10,
              description: 'Clear',
            },
          },
          loading: false,
        },
      }),
    );
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByText('Refresh'));
    fireEvent.click(screen.getByText('Delete'));
    expect(mockDispatch).toHaveBeenCalled();
  });
});
