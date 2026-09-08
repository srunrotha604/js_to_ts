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

  try {
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
  } catch (err) {
    throw err;
  }
};

export const fetchData = async (url, data, method = 'GET') => {
  valid_token_data();
  let alt_fa_storage = localStorage.getItem('e_chanel_storage');
  let token_text = JSON.parse(alt_fa_storage);
  const respond = await axios({
    url: import.meta.env.VITE_API_URL + url,
    method: method,
    data: data,
    headers: {
      Authorization: `Bearer ${token_text.token}`,
      application_id: import.meta.env.VITE_APP_ID,
      company: token_text.company,
      branch: token_text.branch,
      hostName: window.location.origin,
      'Content-Type': 'application/json',
      accept: '*',
    },
  })
    .then((res) => {
      return res;
    })
    .catch((res) => {
      return res.response;
    });
  return respond;
};

export const fetchDataAsync = async (url, { method, data, ...other } = {}) => {
  valid_token_data();

  let alt_fa_storage = localStorage.getItem('e_chanel_storage');

  let token_text = JSON.parse(alt_fa_storage);

  if (!token_text.token) return;

  return axios({
    url: import.meta.env.VITE_API_URL + url,
    method: method ?? 'GET',
    data: data,
    headers: {
      Authorization: `Bearer ${token_text.token}`,
      application_id: import.meta.env.VITE_APP_ID,
      company: token_text.company,
      branch: token_text.branch,
      hostName: window.location.origin,
      'Content-Type': 'application/json',
      accept: '*',
    },
    ...other,
  });
};

export const fileUpload = async (url, data, method = 'GET') => {
  valid_token_data();
  let alt_fa_storage = localStorage.getItem('e_chanel_storage');
  let token_text = JSON.parse(alt_fa_storage);
  const respond = await axios({
    url: import.meta.env.VITE_API_URL + url,
    method: method,
    data: data,
    headers: {
      Authorization: `Bearer ${token_text.token}`,
      application_id: import.meta.env.VITE_APP_ID,
      company: token_text.company,
      branch: token_text.branch,
      hostName: window.location.origin,
      'Content-Type': 'multipart/form-data',
      accept: '*',
    },
  })
    .then((res) => {
      return res;
    })
    .catch((res) => {
      return res.response;
    });
  return respond;
};

export const fileDownload = async (url, data, method = 'GET') => {
  valid_token_data();
  let alt_fa_storage = localStorage.getItem('e_chanel_storage');
  let token_text = JSON.parse(alt_fa_storage);
  const respond = await axios({
    url: import.meta.env.VITE_API_URL + url,
    method: method,
    responseType: 'blob',
    headers: {
      'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token_text.token}`,
      application_id: import.meta.env.VITE_APP_ID,
      company: token_text.company,
      branch: token_text.branch,
      hostName: window.location.origin,
    },
  })
    .then((res) => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'File Name.xlsx');
      document.body.appendChild(link);
      link.click();
    })
    .catch((res) => {
      return res.response;
    });
  return respond;
};
