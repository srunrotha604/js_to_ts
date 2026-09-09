const STORAGE_KEY = 'e_chanel_storage';

export const applyBranchSwitch = (company: string, branch: string): void => {
  const storedValue = localStorage.getItem(STORAGE_KEY) || '';
  const tokenText = JSON.parse(storedValue);
  const nextToken = {
    token: tokenText.token,
    refreshToken: tokenText.refreshToken,
    company,
    branch,
  };
  localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextToken));
};
