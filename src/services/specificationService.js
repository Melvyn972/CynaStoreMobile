import { apiClient } from '../config/api';

export const specificationService = {
  getSpecifications: async () => {
    try {
      const response = await apiClient.get('/specifications');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
