import { apiClient } from '../config/api';

export const companyService = {
  getCompanies: async () => {
    try {
      const response = await apiClient.get('/companies');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createCompany: async (companyData) => {
    try {
      const response = await apiClient.post('/companies', companyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getCompany: async (companyId) => {
    try {
      const response = await apiClient.get(`/companies/${companyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateCompany: async (companyId, companyData) => {
    try {
      const response = await apiClient.put(`/companies/${companyId}`, companyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteCompany: async (companyId) => {
    try {
      const response = await apiClient.delete('/companies', {
        data: { id: companyId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getCompanyMembers: async (companyId, page = 1, limit = 10) => {
    try {
      const response = await apiClient.get(`/companies/${companyId}/members`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getCompanyOrders: async (companyId, page = 1, limit = 10) => {
    try {
      const response = await apiClient.get(`/companies/${companyId}/orders`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateMemberRole: async (companyId, memberId, role) => {
    try {
      const response = await apiClient.put(`/companies/${companyId}/members/${memberId}/role`, {
        role,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  removeMember: async (companyId, memberId) => {
    try {
      const response = await apiClient.delete(`/companies/${companyId}/members/${memberId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  inviteMember: async (companyId, invitationData) => {
    try {
      const response = await apiClient.post(`/companies/${companyId}/invite`, invitationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  leaveCompany: async (companyId) => {
    try {
      const response = await apiClient.post(`/companies/${companyId}/leave`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getInvitations: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get('/companies/invitations', {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  acceptInvitation: async (invitationId) => {
    try {
      const response = await apiClient.post(`/companies/invitations/${invitationId}/accept`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  declineInvitation: async (invitationId) => {
    try {
      const response = await apiClient.post(`/companies/invitations/${invitationId}/decline`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
}; 