import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

jest.mock('../../../commons/constants', () => ({
  WEATHER_API: {
    API_KEY: 'test-key',
    BASE_URL: 'https://api.openweathermap.org',
  },
  __esModule: true,
}));

import weatherService from '../../../services/weather/weatherService';

describe('weatherService', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('getWeatherByCityName should return weather data', async () => {
    const mockData = { name: 'Kyiv', main: { temp: 10 } };
    mock.onGet(/\/data\/2\.5\/weather/).reply(200, mockData);

    const data = await weatherService.getWeatherByCityName('Kyiv');
    expect(data).toEqual(mockData);
  });

  it('getWeatherByCityName should throw on error', async () => {
    mock.onGet(/\/data\/2\.5\/weather/).reply(500);

    await expect(weatherService.getWeatherByCityName('Kyiv')).rejects.toBeTruthy();
  });

  it('getHourlyWeatherByCoords should return forecast data', async () => {
    const mockData = { list: [{ dt: 1, main: { temp: 5 } }] };
    mock.onGet(/\/data\/2\.5\/forecast/).reply(200, mockData);

    const data = await weatherService.getHourlyWeatherByCoords({ lat: 1, lon: 2 });
    expect(data).toEqual(mockData);
  });

  it('getHourlyWeatherByCoords should throw on error', async () => {
    mock.onGet(/\/data\/2\.5\/forecast/).reply(500);

    await expect(weatherService.getHourlyWeatherByCoords({ lat: 1, lon: 2 })).rejects.toBeTruthy();
  });

  it('fetchCitySuggestions should return suggestions', async () => {
    const mockData = [{ name: 'Kyiv', country: 'UA' }];
    mock.onGet(/\/geo\/1\.0\/direct/).reply(200, mockData);

    const data = await weatherService.fetchCitySuggestions('Kyiv');
    expect(data).toEqual(mockData);
  });

  it('fetchCitySuggestions should throw on error', async () => {
    mock.onGet(/\/geo\/1\.0\/direct/).reply(500);

    await expect(weatherService.fetchCitySuggestions('Kyiv')).rejects.toBeTruthy();
  });
});
