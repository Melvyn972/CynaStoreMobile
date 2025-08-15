import { apiClient } from '../config/api';

export const contentService = {
  getCarouselSlides: async () => {
    try {
      const response = await apiClient.get('/public/carousel');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getContentBlocks: async (pageLocation = 'homepage') => {
    try {
      const response = await apiClient.get('/public/content', {
        params: { pageLocation },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
