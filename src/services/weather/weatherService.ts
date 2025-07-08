import { WEATHER_API } from '../../commons/constants';
import type { CitySuggestion, WeatherApiResponse } from '../../commons/interfaces';
import apiService from '../api/apiService';
import axios from 'axios';

async function getWeatherByCityName(cityName: string): Promise<WeatherApiResponse> {
  try {
    return await apiService.get(
      `${WEATHER_API.BASE_URL}/data/2.5/weather?q=${cityName}&appid=${WEATHER_API.API_KEY}&units=metric`,
    );
  } catch (error) {
    throw error;
  }
}

async function getHourlyWeatherByCoords(coord: { lat: number; lon: number }) {
  try {
    const res = await axios.get(
      `${WEATHER_API.BASE_URL}/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${WEATHER_API.API_KEY}&units=metric`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchCitySuggestions(query: string): Promise<CitySuggestion[]> {
  try {
    const res = await axios.get(`${WEATHER_API.BASE_URL}/geo/1.0/direct`, {
      params: {
        q: query,
        limit: 10,
        appid: WEATHER_API.API_KEY,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}

const weatherService = {
  getWeatherByCityName,
  getHourlyWeatherByCoords,
  fetchCitySuggestions,
};

export default weatherService;
