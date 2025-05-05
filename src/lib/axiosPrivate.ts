import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'https://hireflow-server-production.up.railway.app';

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // helpful if you ever use secure cookies
});

// Request interceptor: attach token
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors
axiosPrivate.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      Cookies.remove('token');
      // Optional: Show a toast or push error context
      window.location.href = '/login'; // You could use React Router navigate instead
    }

    return Promise.reject(error);
  }
);