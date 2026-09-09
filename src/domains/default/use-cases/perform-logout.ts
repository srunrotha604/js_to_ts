export const performLogout = (clearUser: () => void): void => {
  localStorage.removeItem('e_chanel_storage');
  clearUser();
};
