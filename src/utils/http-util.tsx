import type { AxiosRequestConfig, ResponseType } from 'axios';
import axios from 'axios';
import { ROUTE_API } from './route-util';

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

const buildHeaders = (tokenText: any, data: unknown) => {
  const headers: Record<string, unknown> = {
    application_id: import.meta.env.VITE_APP_ID,
    company: tokenText.company,
    branch: tokenText.branch,
    hostName: window.location.origin,
    accept: '*',
  };

  if (tokenText.token) {
    headers.Authorization = `Bearer ${tokenText.token}`;
  }
  if (!(data instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

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

type MaybeAxiosResponse<T> = Promise<
  import('axios').AxiosResponse<T> | undefined
>;

interface HttpUtilOptions {
  params?: unknown;
  responseType?: ResponseType;
  signal?: AbortSignal;
  [key: string]: unknown;
}

const request = async <T = unknown,>(
  url: string,
  method: string,
  data?: unknown,
  options: HttpUtilOptions = {}
): MaybeAxiosResponse<T> => {
  valid_token_data();
  const token_text = readStoredToken();

  const config: AxiosRequestConfig = {
    ...options,
    url: import.meta.env.VITE_API_URL + url,
    method: method as AxiosRequestConfig['method'],
    data,
    headers: buildHeaders(token_text, data) as AxiosRequestConfig['headers'],
  };

  return axios<T>(config)
    .then((res) => res)
    .catch((res) => res.response);
};

interface HttpUtilFn {
  get: <T = unknown>(
    url: string,
    options?: HttpUtilOptions
  ) => MaybeAxiosResponse<T>;
  post: <T = unknown>(
    url: string,
    data?: unknown,
    options?: HttpUtilOptions
  ) => MaybeAxiosResponse<T>;
  put: <T = unknown>(
    url: string,
    data?: unknown,
    options?: HttpUtilOptions
  ) => MaybeAxiosResponse<T>;
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    options?: HttpUtilOptions
  ) => MaybeAxiosResponse<T>;
  delete: <T = unknown>(
    url: string,
    data?: unknown,
    options?: HttpUtilOptions
  ) => MaybeAxiosResponse<T>;
}

export const HttpUtil: HttpUtilFn = {
  get: (url, options) => request(url, 'GET', undefined, options),
  post: (url, data, options) => request(url, 'POST', data, options),
  put: (url, data, options) => request(url, 'PUT', data, options),
  patch: (url, data, options) => request(url, 'PATCH', data, options),
  delete: (url, data, options) => request(url, 'DELETE', data, options),
};
