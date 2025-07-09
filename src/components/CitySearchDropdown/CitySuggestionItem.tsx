import React from 'react';

interface CitySuggestionItemProps {
  city: {
    name: string;
    state?: string;
    country: string;
  };
  onAddCity: (name: string) => void;
}

export const CitySuggestionItem = React.memo(({ city, onAddCity }: CitySuggestionItemProps) => (
  <li
    className="city-search-dropdown__suggestion"
    onClick={() => onAddCity(city.name)}
    aria-label={`Add ${city.name} to your cities`}
  >
    <span>
      {city.name}
      {city.state ? `, ${city.state}` : ''} ({city.country})
    </span>
    <button>➕</button>
  </li>
));
