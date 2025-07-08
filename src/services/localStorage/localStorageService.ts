import { STORAGE } from '../../commons/constants';

const save = (cities: string[]): void => {
  localStorage.setItem(STORAGE.KEY, JSON.stringify(cities));
};

const load = (): string[] => {
  const raw = localStorage.getItem(STORAGE.KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const clear = (): void => {
  localStorage.removeItem(STORAGE.KEY);
};

const localStorageService = {
  save,
  load,
  clear,
};

export default localStorageService;
