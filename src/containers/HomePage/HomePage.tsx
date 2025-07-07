import { WeatherCard } from '../../components/WeatherCard/WeatherCard';

const mockCities = [
  {
    city: 'Kyiv',
    temperature: 26,
    description: 'Sunny',
  },
  {
    city: 'Lviv',
    temperature: 22,
    description: 'Cloudy',
  },
   {
    city: 'Kyiv',
    temperature: 26,
    description: 'Sunny',
  },
  {
    city: 'Lviv',
    temperature: 22,
    description: 'Cloudy',
  },
   {
    city: 'Kyiv',
    temperature: 26,
    description: 'Sunny',
  },
  {
    city: 'Lviv',
    temperature: 22,
    description: 'Cloudy',
  },
   {
    city: 'Kyiv',
    temperature: 26,
    description: 'Sunny',
  },
  {
    city: 'Lviv',
    temperature: 22,
    description: 'Cloudy',
  },
];

export const HomePage = () => {
  return (
    <div className="weather-list">
      {mockCities.map((city) => (
        <WeatherCard
          key={city.city}
          city={city.city}
          temperature={city.temperature}
          description={city.description}
          onClick={() => alert(`Detailed: ${city.city}`)}
          onRefresh={() => alert(`Refresh: ${city.city}`)}
        />
      ))}
    </div>
  );
};
