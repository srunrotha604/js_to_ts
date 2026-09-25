import { STORAGE_KEY } from '../../../utils/storage-key';

export const performLogout = (clearUser: () => void): void => {
  localStorage.removeItem(STORAGE_KEY);
  clearUser();
};
