import localStorageService, {
  save,
  load,
} from '../../../services/localStorage/localStorageService';

jest.mock('../../../commons/constants', () => ({
  STORAGE: { KEY: 'weather_cities' },
  __esModule: true,
}));

describe('localStorageService', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('save should store city names as JSON', () => {
    const cities = ['Kyiv', 'London'];
    save(cities);
    expect(localStorage.getItem('cities')).toBe(JSON.stringify(cities));
  });

  it('load should return parsed city names', () => {
    const cities = ['Kyiv', 'London'];
    localStorage.setItem('cities', JSON.stringify(cities));
    expect(load()).toEqual(cities);
  });

  it('load should return empty array if nothing in storage', () => {
    localStorage.removeItem('cities');
    expect(load()).toEqual([]);
  });

  it('clear should remove STORAGE.KEY', () => {
    localStorage.setItem('weather_cities', 'something');
    localStorageService.clear();
    expect(localStorage.getItem('weather_cities')).toBeNull();
  });

  it('save should not throw if localStorage throws', () => {
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => {
      throw new Error('fail');
    };
    expect(() => save(['Kyiv'])).not.toThrow();
    localStorage.setItem = originalSetItem;
  });

  it('load should not throw if localStorage throws', () => {
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = () => {
      throw new Error('fail');
    };
    expect(load()).toEqual([]);
    localStorage.getItem = originalGetItem;
  });
});
