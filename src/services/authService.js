import { apiClient } from '../config/api';
import { storeToken, storeUser, clearStoredToken } from '../utils/auth';

export const authService = {
  // Step 1: Send magic link to email
  sendMagicLink: async (email) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
      });
      
      return response.data;
    } catch (error) {
      console.error('Magic link error:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to send magic link. Please try again.');
      }
    }
  },

  // Step 2: Verify magic link token
  verifyMagicLink: async (token) => {
    try {
      const response = await apiClient.post('/auth/login', {
        token,
      });
      
      const { token: authToken, user } = response.data;
      
      if (authToken) {
        await storeToken(authToken);
        await storeUser(user);
      }
      
      return response.data;
    } catch (error) {
      console.error('Token verification error:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Token verification failed. Please try again.');
      }
    }
  },

  // Legacy method for backward compatibility (now uses magic link)
  login: async (email, password) => {
    console.warn('Password login is deprecated. Use sendMagicLink instead.');
    return await this.sendMagicLink(email);
  },

  register: async (email, name) => {
    try {
      const response = await apiClient.post('/auth/register', {
        email,
        name,
      });
      
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      await clearStoredToken();
    } catch (error) {
      await clearStoredToken();
      throw error.response?.data || error;
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await apiClient.post('/auth/verify', { token });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
}; 