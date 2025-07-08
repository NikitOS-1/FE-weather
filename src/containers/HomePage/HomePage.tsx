import { WeatherCard } from '../../components/WeatherCard/WeatherCard';
import './HomePage.scss';


const mockCities = [
  {
    city: 'Kyiv',
    temperature: 26,
    description: 'Sunny',
  },
  {
    city: 'Dneproteprovsk',
    temperature: 22,
    description: 'Cloudy',
  },
  {
    city: 'Dneproteprovskg',
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
      <section>
        <input type="text" placeholder="search city" />
      </section>
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
