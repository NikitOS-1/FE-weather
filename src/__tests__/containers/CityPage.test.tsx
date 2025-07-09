import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CityPage from '../../containers/CityPage/CityPage';
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

jest.mock('../../services/weather/weatherService', () => ({
  __esModule: true,
  default: {
    getHourlyWeatherByCoords: jest.fn(),
  },
}));

jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="chart" />,
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CityPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderWithRouter(cityKey = 'Kyiv') {
    return render(
      <MemoryRouter initialEntries={[`/${cityKey}`]}>
        <Routes>
          <Route path="/:cityKey" element={<CityPage />} />
        </Routes>
      </MemoryRouter>,
    );
  }

  it('renders loader if weather is not loaded', () => {
    require('../../helpers/useAppSelector').useAppSelector.mockImplementation(() => null);
    renderWithRouter();
    expect(screen.getByLabelText('Loading weather data')).toBeInTheDocument();
  });

  it('renders error if error state is set', async () => {
    require('../../helpers/useAppSelector').useAppSelector.mockImplementation(() => ({
      name: 'Kyiv',
      lat: 1,
      lon: 2,
    }));
    require('../../services/weather/weatherService').default.getHourlyWeatherByCoords.mockRejectedValue(
      new Error('fail'),
    );

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Failed to load hourly forecast data')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
    });
  });

  it('renders weather data and chart', async () => {
    require('../../helpers/useAppSelector').useAppSelector.mockImplementation(() => ({
      name: 'Kyiv',
      country: 'UA',
      icon: '01d',
      description: 'Clear',
      temperature: 20,
      humidity: 50,
      windSpeed: 5,
      pressure: 1012,
      lat: 1,
      lon: 2,
    }));
    require('../../services/weather/weatherService').default.getHourlyWeatherByCoords.mockResolvedValue(
      {
        list: [
          { dt: 1710000000, main: { temp: 10 } },
          { dt: 1710003600, main: { temp: 12 } },
        ],
      },
    );

    renderWithRouter();

    expect(await screen.findByText('Kyiv')).toBeInTheDocument();
    expect(screen.getByText('20°C')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
    expect(screen.getByText(/Humidity:/)).toBeInTheDocument();
    expect(screen.getByText(/Wind:/)).toBeInTheDocument();
    expect(screen.getByText(/Pressure:/)).toBeInTheDocument();
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });

  it('calls navigate(-1) when Go back is clicked', async () => {
    require('../../helpers/useAppSelector').useAppSelector.mockImplementation(() => ({
      name: 'Kyiv',
      lat: 1,
      lon: 2,
    }));
    require('../../services/weather/weatherService').default.getHourlyWeatherByCoords.mockRejectedValue(
      new Error('fail'),
    );

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /go back/i }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
