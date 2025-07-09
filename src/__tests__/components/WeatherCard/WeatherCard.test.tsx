import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WeatherCard } from '../../../components/WeatherCard/WeatherCard';

jest.mock('../../../asset/icon/delete.svg', () => 'delete-icon.svg');
jest.mock('../../../asset/icon/refresh.svg', () => 'refresh-icon.svg');
jest.mock('../../../commons/constants', () => ({
  getWeatherIcon: jest.fn(() => <span data-testid="weather-icon">🌤️</span>),
}));
jest.mock('../../../helpers/formatTime', () => ({
  formatTime: jest.fn(() => '12:00'),
}));

jest.mock('../../../helpers/useAppSelector', () => ({
  useAppSelector: jest.fn(),
}));

describe('WeatherCard', () => {
  const baseProps = {
    city: 'Kyiv',
    country: 'UA',
    icon: '01d',
    updatedAt: 123456,
    temperature: 20,
    description: 'Clear sky',
    onClick: jest.fn(),
    onRefresh: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders city, country, temperature and description', () => {
    require('../../../helpers/useAppSelector').useAppSelector.mockReturnValue({});
    render(<WeatherCard {...baseProps} />);
    expect(screen.getByText('Kyiv, UA')).toBeInTheDocument();
    expect(screen.getByText('20°C')).toBeInTheDocument();
    expect(screen.getByText('Clear sky')).toBeInTheDocument();
    expect(screen.getByText('Updated: 12:00')).toBeInTheDocument();
    expect(screen.getByTestId('weather-icon')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    require('../../../helpers/useAppSelector').useAppSelector.mockReturnValue({});
    render(<WeatherCard {...baseProps} />);
    fireEvent.click(screen.getByRole('region'));
    expect(baseProps.onClick).toHaveBeenCalled();
  });

  it('calls onRefresh when refresh button is clicked', () => {
    require('../../../helpers/useAppSelector').useAppSelector.mockReturnValue({});
    render(<WeatherCard {...baseProps} />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(baseProps.onRefresh).toHaveBeenCalled();
  });

  it('calls onDelete when delete button is clicked', () => {
    require('../../../helpers/useAppSelector').useAppSelector.mockReturnValue({});
    render(<WeatherCard {...baseProps} />);
    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(baseProps.onDelete).toHaveBeenCalled();
  });

  it('shows loader when isLoading is true', () => {
    require('../../../helpers/useAppSelector').useAppSelector.mockReturnValue({ Kyiv: true });
    render(<WeatherCard {...baseProps} />);
    expect(screen.getByTestId('loader-gradient')).toBeInTheDocument();
  });
});
