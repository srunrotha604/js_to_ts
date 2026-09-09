import axios from 'axios';
import { ROUTE_API } from '../utils/route-util';

export const valid_token_data = () => {
  const storage = localStorage.getItem('e_chanel_storage');

  const defaultData = {
    token: '',
    refreshToken: '',
    login_return_url: '',
    company: '',
    branch: '',
    hostName: window.location.origin,
  };

  if (!storage) {
    localStorage.setItem('e_chanel_storage', JSON.stringify(defaultData));
    return;
  }

  try {
    const parsed = JSON.parse(storage);
    const merged = { ...defaultData, ...parsed };
    localStorage.setItem('e_chanel_storage', JSON.stringify(merged));
  } catch (e) {
    localStorage.setItem('e_chanel_storage', JSON.stringify(defaultData));
  }
};

const readStoredToken = () => {
  const alt_fa_storage = localStorage.getItem('e_chanel_storage') || '';
  return JSON.parse(alt_fa_storage);
};

const buildAuthHeaders = (tokenText: any, contentType: string) => ({
  Authorization: `Bearer ${tokenText.token}`,
  application_id: import.meta.env.VITE_APP_ID,
  company: tokenText.company,
  branch: tokenText.branch,
  hostName: window.location.origin,
  'Content-Type': contentType,
  accept: '*',
});

export const refreshToken = async () => {
  const storage = localStorage.getItem('e_chanel_storage');

  if (!storage) {
    throw new Error('No token data in localStorage');
  }

  let token_text;
  try {
    token_text = JSON.parse(storage);
  } catch (e) {
    throw new Error('Invalid token data in localStorage');
  }

  if (!token_text.token || !token_text.refreshToken) {
    throw new Error('Missing token / refreshToken');
  }

  const data = {
    token: token_text.token,
    refreshToken: token_text.refreshToken,
  };

  const res = await axios({
    url: import.meta.env.VITE_API_URL + ROUTE_API.loginRefreshToken,
    method: 'POST',
    data: data,
    headers: {
      application_id: import.meta.env.VITE_APP_ID,
      'Content-Type': 'application/json',
      accept: '*/*',
    },
  });

  const alt_fa_token = {
    token: res.data.token,
    refreshToken: res.data.refreshToken,
    company: token_text.company || '',
    branch: token_text.branch || '',
    hostName: window.location.origin,
    login_return_url: token_text.login_return_url || '',
  };

  localStorage.setItem('e_chanel_storage', JSON.stringify(alt_fa_token));

  return alt_fa_token;
};

// Swallows request failures into the returned value (callers switch on `.status`),
// unlike fetchDataAsync below which lets failures throw (callers try/catch).
export const fetchData = async <T = unknown>(
  url: string,
  data: unknown,
  method = 'GET'
): Promise<import('axios').AxiosResponse<T> | undefined> => {
  valid_token_data();
  const token_text = readStoredToken();
  const respond = await axios<T>({
    url: import.meta.env.VITE_API_URL + url,
    method: method,
    data: data,
    headers: buildAuthHeaders(token_text, 'application/json'),
  })
    .then((res) => {
      return res;
    })
    .catch((res) => {
      return res.response;
    });
  return respond;
};

interface FetchDataAsyncOptions {
  method?: string;
  data?: unknown;
  [key: string]: unknown;
}

// Lets request failures throw (callers try/catch), unlike fetchData/fileUpload
// above/below which swallow failures into the returned value.
export const fetchDataAsync = async <T = unknown>(
  url: string,
  { method, data, ...other }: FetchDataAsyncOptions = {}
): Promise<import('axios').AxiosResponse<T> | undefined> => {
  valid_token_data();

  const token_text = readStoredToken();

  if (!token_text.token) return;

  return axios({
    url: import.meta.env.VITE_API_URL + url,
    method: method ?? 'GET',
    data: data,
    headers: buildAuthHeaders(token_text, 'application/json'),
    ...other,
  });
};

export const fileUpload = async <T = unknown>(
  url: string,
  data: unknown,
  method = 'GET'
): Promise<import('axios').AxiosResponse<T> | undefined> => {
  valid_token_data();
  const token_text = readStoredToken();
  const respond = await axios<T>({
    url: import.meta.env.VITE_API_URL + url,
    method: method,
    data: data,
    headers: buildAuthHeaders(token_text, 'multipart/form-data'),
  })
    .then((res) => {
      return res;
    })
    .catch((res) => {
      return res.response;
    });
  return respond;
};
