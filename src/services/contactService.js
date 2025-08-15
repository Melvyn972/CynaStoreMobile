import { apiClient } from '../config/api';

export const contactService = {
  sendContactMessage: async (contactData) => {
    try {
      const response = await apiClient.post('/contact', contactData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
