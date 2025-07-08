import './WeatherCard.scss';
import deleteIcon from '../../asset/icon/delete.svg';
import refreshIcon from '../../asset/icon/refresh.svg';
import { getWeatherIcon } from '../../commons/constants';
import { useAppSelector } from '../../helpers/useAppSelector';

interface WeatherCardProps {
  city: string;
  country: string;
  icon: string;
  updatedAt: number;
  temperature: number;
  description: string;
  state?: string;
  onClick: () => void;
  onRefresh: () => void;
  onDelete: () => void;
}

export const WeatherCard = ({
  city,
  temperature,
  description,
  icon,
  country,
  updatedAt,
  onClick,
  onRefresh,
  onDelete,
}: WeatherCardProps) => {
  // const loadingByCity = useAppSelector((state) => state.weather.loadingByCity);

  function formatTime(timestamp: number) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  const isLoading = false;
  return (
    <section
      className={`weather-card${isLoading ? ' weather-card--loading' : ''}`}
      onClick={onClick}
    >
      {isLoading && (
        <div className="weather-card__loader">
          <div className="weather-card__loader-gradient" />
        </div>
      )}
      <div className="weather-card__header">
        <h3 className="weather-card__header__title">
          {city}, {country}
        </h3>
      </div>
      <div className="weather-card__image-info">{getWeatherIcon(icon)}</div>
      <div className="weather-card__body">
        <div className="weather-card__body__description">
          <h3 className="weather-card__body__description-temp">{Math.round(temperature)}°C</h3>
          <p className="weather-card__body__description-info">{description}</p>
        </div>
        <div className="weather-card__body__btn-group">
          <button
            className="weather-card__body__btn-group--hover"
            onClick={(e) => {
              e.stopPropagation();
              onRefresh();
            }}
          >
            <img src={refreshIcon} alt="Refresh weather/button" />
          </button>
          <button
            className="weather-card__body__btn-group--hover"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <img src={deleteIcon} alt="Delete city/button" />
          </button>
          <p className="weather-card__body__description-updated">
            Updated: {formatTime(updatedAt)}
          </p>
        </div>
      </div>
    </section>
  );
};
