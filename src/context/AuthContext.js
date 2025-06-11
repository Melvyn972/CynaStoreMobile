import React, { createContext, useContext, useEffect, useState } from 'react';
import { getStoredToken, getStoredUser } from '../utils/auth';
import { authService } from '../services/authService';

const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  register: () => {},
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await getStoredToken();
      const userData = await getStoredUser();
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMagicLink = async (email) => {
    try {
      const response = await authService.sendMagicLink(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const verifyMagicLink = async (token) => {
    try {
      const response = await authService.verifyMagicLink(token);
      setIsAuthenticated(true);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Legacy login method
  const login = {
    sendMagicLink,
    verifyMagicLink,
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local state
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const register = async (email, name) => {
    try {
      const response = await authService.register(email, name);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    register,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 