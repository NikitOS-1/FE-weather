// App.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import App from '../../containers/App/App';

describe('App Component', () => {
  test('renders App component', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    const linkElement = screen.getByText(/App/i);
    expect(linkElement).toBeInTheDocument();
  });
});
