import { InputField } from '../../components/InputField/InputField';
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
    <main className="home-page">
      <section className="home-page__search">
        <InputField placeholder="Search city" />
      </section>
      <section className="home-page__weather-list">
        {mockCities.map((city) => (
          <WeatherCard
            key={city.city}
            city={city.city}
            temperature={city.temperature}
            description={city.description}
            onClick={() => alert(`Detailed: ${city.city}`)}
            onRefresh={() => alert(`Refresh: ${city.city}`)}
            onDelete={() => alert(`Deleted: ${city.city}`)}
          />
        ))}
      </section>
    </main>
  );
};
