import axios from 'axios';
import { API_CONFIG } from './constants';

export const API_BASE_URL = API_CONFIG.BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const { getStoredToken } = await import('../utils/auth');
      const token = await getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and retries
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Handle unauthorized access
      const { clearStoredToken } = await import('../utils/auth');
      await clearStoredToken();
      
      // You can add navigation to login screen here
      // Example: NavigationService.navigate('Login');
    }

    // Handle network errors and timeouts
    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
); 