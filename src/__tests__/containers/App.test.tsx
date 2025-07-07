import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import App from '../../containers/App/App';

describe('App Component', () => {
  test('renders App component', () => {
    // Given
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    // When
    const linkElement = screen.getByText(/App/i);

    // Then
    expect(linkElement).toBeInTheDocument();
  });
});
