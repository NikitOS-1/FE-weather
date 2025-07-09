import React from 'react';
import './WeatherCard.scss';
import deleteIcon from '../../asset/icon/delete.svg';
import refreshIcon from '../../asset/icon/refresh.svg';
import { getWeatherIcon } from '../../commons/constants';
import { useAppSelector } from '../../helpers/useAppSelector';
import { formatTime } from '../../helpers/formatTime';

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

export const WeatherCard = React.memo(
  ({
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
    const loadingByCity = useAppSelector((state) => state.weather.loadingByCity);

    const isLoading = loadingByCity[city] || loadingByCity[`${city}, ${country}`];
    const formattedTemperature = Math.round(temperature);
    const locationName = `${city}, ${country}`;
    const formattedTime = formatTime(updatedAt);

    const handleRefreshClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onRefresh();
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete();
    };

    return (
      <section
        className={`weather-card${isLoading ? ' weather-card--loading' : ''}`}
        onClick={onClick}
        aria-label={`Weather card for ${locationName}`}
      >
        {isLoading && (
          <div className="weather-card__loader">
            <div className="weather-card__loader-gradient" />
          </div>
        )}

        <div className="weather-card__header">
          <h3 className="weather-card__header__title">{locationName}</h3>
        </div>

        <div className="weather-card__image-info">{getWeatherIcon(icon)}</div>

        <div className="weather-card__body">
          <div className="weather-card__body__description">
            <h3 className="weather-card__body__description-temp">{formattedTemperature}°C</h3>
            <p className="weather-card__body__description-info">{description}</p>
          </div>

          <div className="weather-card__body__btn-group">
            <button
              className="weather-card__body__btn-group--hover"
              onClick={handleRefreshClick}
              aria-label="Refresh weather data"
            >
              <img src={refreshIcon} alt="" />
            </button>

            <button
              className="weather-card__body__btn-group--hover"
              onClick={handleDeleteClick}
              aria-label="Delete city"
            >
              <img src={deleteIcon} alt="" />
            </button>

            <p className="weather-card__body__description-updated">Updated: {formattedTime}</p>
          </div>
        </div>
      </section>
    );
  },
);
