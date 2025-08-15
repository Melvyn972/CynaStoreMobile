import { apiClient } from '../config/api';

export const categoryService = {
  getCategories: async () => {
    try {
      const response = await apiClient.get('/public/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
