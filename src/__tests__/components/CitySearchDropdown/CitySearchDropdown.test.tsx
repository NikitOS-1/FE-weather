import '@testing-library/jest-dom';


jest.mock('../../../commons/constants', () => ({
  WEATHER_API: {
    API_KEY: 'test-key',
    BASE_URL: 'https://api.openweathermap.org',
  },
  STORAGE: { KEY: 'weather_cities' },
  getWeatherIcon: () => '☀️',
  __esModule: true,
}));

const mockDispatch = jest.fn();
jest.mock('../../../helpers/useAppDispatch', () => ({
  useAppDispatch: () => mockDispatch,
}));
jest.mock('../../../helpers/useAppSelector', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('../../../helpers/debounce', () => ({
  debounce: (fn: any) => {
    fn.cancel = jest.fn();
    return fn;
  },
}));

jest.mock('../../../components/CitySearchDropdown/CitySuggestionItem', () => ({
  CitySuggestionItem: ({ city, onAddCity }: any) => (
    <li data-testid="suggestion" onClick={() => onAddCity(city.name)}>
      {city.name}
    </li>
  ),
}));

import { render, screen, fireEvent, act } from '@testing-library/react';
import { CitySearchDropdown } from '../../../components/CitySearchDropdown/CitySearchDropdown';

describe('CitySearchDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    require('../../../helpers/useAppSelector').useAppSelector.mockImplementation((fn: any) =>
      fn({
        citySearch: { suggestions: [], loading: false, error: null },
        weather: { cityNames: [], error: null },
      }),
    );
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders input', () => {
    render(<CitySearchDropdown />);
    expect(screen.getByPlaceholderText('Enter the city name...')).toBeInTheDocument();
  });

  it('shows error message when errorVisible is true', () => {
    // @ts-ignore
    require('../../../helpers/useAppSelector').useAppSelector.mockImplementation((fn: any) =>
      fn({
        citySearch: { suggestions: [], loading: false, error: null },
        weather: { cityNames: [], error: 'Some error' },
      }),
    );
    render(<CitySearchDropdown />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('City not found')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(4000);
    });
  });

  it('shows suggestions when suggestionsVisible and suggestions exist', () => {
    // @ts-ignore
    require('../../../helpers/useAppSelector').useAppSelector.mockImplementation((fn: any) =>
      fn({
        citySearch: { suggestions: [{ name: 'Kyiv', country: 'UA' }], loading: false, error: null },
        weather: { cityNames: [], error: null },
      }),
    );
    render(<CitySearchDropdown />);
    fireEvent.change(screen.getByPlaceholderText('Enter the city name...'), {
      target: { value: 'Ky' },
    });
    expect(screen.getByTestId('suggestion')).toBeInTheDocument();
    expect(screen.getByText('Kyiv')).toBeInTheDocument();
  });

  it('calls handleAddCity when suggestion is clicked', () => {
    // @ts-ignore
    require('../../../helpers/useAppSelector').useAppSelector.mockImplementation((fn: any) =>
      fn({
        citySearch: { suggestions: [{ name: 'Kyiv', country: 'UA' }], loading: false, error: null },
        weather: { cityNames: [], error: null },
      }),
    );
    render(<CitySearchDropdown />);
    fireEvent.change(screen.getByPlaceholderText('Enter the city name...'), {
      target: { value: 'Ky' },
    });
    fireEvent.click(screen.getByTestId('suggestion'));
    expect((screen.getByPlaceholderText('Enter the city name...') as HTMLInputElement).value).toBe(
      '',
    );
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('shows "City already exists" if city exist', () => {
    // @ts-ignore
    require('../../../helpers/useAppSelector').useAppSelector.mockImplementation((fn: any) =>
      fn({
        citySearch: { suggestions: [{ name: 'Kyiv', country: 'UA' }], loading: false, error: null },
        weather: { cityNames: ['Kyiv'], error: null },
      }),
    );
    render(<CitySearchDropdown />);
    fireEvent.change(screen.getByPlaceholderText('Enter the city name...'), {
      target: { value: 'Ky' },
    });
    fireEvent.click(screen.getByTestId('suggestion'));
    expect(screen.getByText('City already exists')).toBeInTheDocument();
  });
});
