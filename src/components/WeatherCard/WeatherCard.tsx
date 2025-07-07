import './WeatherCard.scss';

interface WeatherCardProps {
  city: string;
  temperature: number;
  description: string;
  onClick: () => void;
  onRefresh: () => void;
}

export const WeatherCard = ({
  city,
  temperature,
  description,
  onClick,
  onRefresh,
}: WeatherCardProps) => {
  return (
    <div className="weather-card" onClick={onClick}>
      <div className="weather-card__header">
        <h2 className="weather-card__city">{city}</h2>
        <button
          className="weather-card__refresh"
          onClick={(e) => {
            e.stopPropagation();
            onRefresh();
          }}
        >
          🔄
        </button>
      </div>
      <div className="weather-card__body">
        <p className="weather-card__temp">{temperature}°C</p>
        <p className="weather-card__desc">{description}</p>
      </div>
    </div>
  );
};
