import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../containers/App/App';
import '@testing-library/jest-dom';

jest.mock('../../containers/HomePage/HomePage', () => ({
  HomePage: () => <div data-testid="home-page">HomePage</div>,
}));
jest.mock('../../containers/CityPage/CityPage', () => ({
  __esModule: true,
  default: () => <div data-testid="city-page">CityPage</div>,
}));

describe('App', () => {
  it('renders HomePage on root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('renders CityPage on /:cityKey route', () => {
    render(
      <MemoryRouter initialEntries={['/kyiv']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('city-page')).toBeInTheDocument();
  });
});
