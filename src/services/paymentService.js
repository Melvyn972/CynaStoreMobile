import { apiClient } from '../config/api';

export const paymentService = {
  createCheckout: async (items, metadata = {}) => {
    try {
      const response = await apiClient.post('/stripe/create-checkout', {
        items,
        metadata,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createCartCheckout: async (metadata = {}) => {
    try {
      const response = await apiClient.post('/stripe/create-cart-checkout', {
        metadata,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createCompanyCheckout: async (companyData, metadata = {}) => {
    try {
      const response = await apiClient.post('/stripe/create-company-checkout', {
        ...companyData,
        metadata,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createPortalSession: async () => {
    try {
      const response = await apiClient.post('/stripe/create-portal');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  verifySession: async (sessionId) => {
    try {
      const response = await apiClient.post('/stripe/verify-session', {
        sessionId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
}; 