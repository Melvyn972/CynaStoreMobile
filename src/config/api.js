import axios from 'axios';
import { API_CONFIG } from './constants';

export const API_BASE_URL = API_CONFIG.BASE_URL;

// Create axios instance with better mobile configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Network connectivity check
export const checkNetworkConnectivity = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'GET',
      timeout: 5000,
    });
    return response.ok;
  } catch (error) {
    console.log('Network connectivity check failed:', error);
    return false;
  }
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const { getStoredToken } = await import('../utils/auth');
      const token = await getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log request for debugging
      console.log(`Making request to: ${config.baseURL}${config.url}`);
      console.log('Full request config:', {
        baseURL: config.baseURL,
        url: config.url,
        method: config.method,
        fullURL: `${config.baseURL}${config.url}`
      });
    } catch (error) {
      console.log('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle authentication errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const { clearStoredToken } = await import('../utils/auth');
      await clearStoredToken();
    }

    // Enhanced network error handling
    if (!error.response) {
      console.error('Network error details:', {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
        }
      });
      
      // Check if it's a timeout
      if (error.code === 'ECONNABORTED') {
        error.message = 'Request timeout - Please check your internet connection';
      } else if (error.message === 'Network Error') {
        error.message = 'Cannot connect to server - Please check your network connection';
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to test API connectivity
export const testAPIConnection = async () => {
  try {
    console.log('Testing API connection to:', API_BASE_URL);
    const response = await apiClient.get('/articles', { timeout: 10000 });
    console.log('API connection test successful:', response.status);
    return true;
  } catch (error) {
    console.error('API connection test failed:', error.message);
    return false;
  }
}; 