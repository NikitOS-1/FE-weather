import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { CitySuggestionItem } from '../../../components/CitySearchDropdown/CitySuggestionItem';

describe('CitySuggestionItem', () => {
  it('renders city name and country', () => {
    render(<CitySuggestionItem city={{ name: 'Kyiv', country: 'UA' }} onAddCity={jest.fn()} />);
    expect(screen.getByText('Kyiv (UA)')).toBeInTheDocument();
  });

  it('renders city name, state and country if state is present', () => {
    render(
      <CitySuggestionItem
        city={{ name: 'Los Angeles', state: 'CA', country: 'US' }}
        onAddCity={jest.fn()}
      />,
    );
    expect(screen.getByText('Los Angeles, CA (US)')).toBeInTheDocument();
  });

  it('calls onAddCity with city name when clicked', () => {
    const onAddCity = jest.fn();
    render(<CitySuggestionItem city={{ name: 'London', country: 'GB' }} onAddCity={onAddCity} />);
    fireEvent.click(screen.getByRole('listitem'));
    expect(onAddCity).toHaveBeenCalledWith('London');
  });

  it('has correct aria-label', () => {
    render(<CitySuggestionItem city={{ name: 'Berlin', country: 'DE' }} onAddCity={jest.fn()} />);
    expect(screen.getByLabelText('Add Berlin to your cities')).toBeInTheDocument();
  });

  it('renders the plus button', () => {
    render(<CitySuggestionItem city={{ name: 'Paris', country: 'FR' }} onAddCity={jest.fn()} />);
    expect(screen.getByRole('button')).toHaveTextContent('➕');
  });
});
