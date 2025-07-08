import './WeatherCard.scss';
import deleteIcon from '../../asset/icon/delete.svg';
import refreshIcon from '../../asset/icon/refresh.svg';
import sunnyIcon from '../../asset/icon/weaters/sunny_24dp_434343_FILL0_wght400_GRAD0_opsz24.svg';

interface WeatherCardProps {
  city: string;
  temperature: number;
  description: string;
  onClick: () => void;
  onRefresh: () => void;
  onDelete: () => void;
}

export const WeatherCard = ({
  city,
  temperature,
  description,
  onClick,
  onRefresh,
  onDelete,
}: WeatherCardProps) => {
  return (
    <section className="weather-card" onClick={onClick}>
      <div className="weather-card__header">
        <h3 className="weather-card__header__title">{city}</h3>
      </div>
      <div className="weather-card__image-info">
        <img src={sunnyIcon} alt="Weather" />
      </div>
      <div className="weather-card__body">
        <div className="weather-card__body__description">
          <h3 className="weather-card__body__description-temp">{temperature}°C</h3>
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
        </div>
      </div>
    </section>
  );
};
