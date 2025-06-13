import { apiClient } from '../config/api';

export const userService = {
  getUserProfile: async () => {
    try {
      const response = await apiClient.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateUserProfile: async (userData) => {
    try {
      const response = await apiClient.put('/user/profile', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUserOrders: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/user/orders', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteAccount: async () => {
    try {
      const response = await apiClient.delete('/user/delete-account');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  exportUserData: async () => {
    try {
      const response = await apiClient.get('/user/export-data');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getConsent: async () => {
    try {
      const response = await apiClient.get('/user/consent');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateConsent: async (consentData) => {
    try {
      const response = await apiClient.put('/user/consent', consentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
}; 