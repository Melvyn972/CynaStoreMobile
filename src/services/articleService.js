import { apiClient } from '../config/api';

export const articleService = {
  getArticles: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/articles', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getArticle: async (id) => {
    try {
      const response = await apiClient.get(`/articles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  searchArticles: async (query, page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/articles/search', {
        params: { q: query, page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
}; 