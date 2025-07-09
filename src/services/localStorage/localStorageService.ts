import { STORAGE } from '../../commons/constants';

export const save = (cityNames: string[]) => {
  try {
    localStorage.setItem('cities', JSON.stringify(cityNames));
  } catch (error) {
    console.error('localStorage save error:', error);
  }
};

export const load = (): string[] => {
  try {
    const data = localStorage.getItem('cities');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('localStorage load error:', error);
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
