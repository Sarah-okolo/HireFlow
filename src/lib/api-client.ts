
import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'https://api.example.com'; // Replace with your actual API URL

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response || {};
    
    if (status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      Cookies.remove('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);
