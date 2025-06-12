// API Configuration
export const API_CONFIG = {
  // Base URL for the backend API - update this to your CynaStoreWeb deployment URL
  BASE_URL: process.env.API_URL || 'http://localhost:3000/api',
  
  // Timeout for API requests (in milliseconds)
  TIMEOUT: 10000,
  
  // Headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

// App Configuration
export const APP_CONFIG = {
  // App name and version
  APP_NAME: 'CynaStore Mobile',
  APP_VERSION: '1.0.0',
  
  // Pagination defaults
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  
  // Cache TTL (in minutes)
  CACHE_TTL: 30,
};

// Auth Configuration
export const AUTH_CONFIG = {
  // Token storage keys
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'user_data',
  
  // Token refresh threshold (in minutes before expiry)
  REFRESH_THRESHOLD: 30,
};

// UI Constants
export const UI_CONFIG = {
  // Animation durations (in milliseconds)
  ANIMATION_DURATION: 300,
  LOADING_DELAY: 500,
  
  // Toast display duration
  TOAST_DURATION: 3000,
  
  // Error retry attempts
  MAX_RETRY_ATTEMPTS: 3,
}; 