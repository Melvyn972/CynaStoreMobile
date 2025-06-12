import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_CONFIG } from '../config/constants';

const TOKEN_KEY = AUTH_CONFIG.TOKEN_KEY;
const USER_KEY = AUTH_CONFIG.USER_KEY;

export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing token:', error);
    throw error;
  }
};

export const getStoredToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const clearStoredToken = async () => {
  try {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  } catch (error) {
    console.error('Error clearing token:', error);
  }
};

export const storeUser = async (userData) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user data:', error);
    throw error;
  }
};

export const getStoredUser = async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Utility function to check if token is expired (optional - requires JWT parsing)
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token expires within the refresh threshold
    const refreshThreshold = AUTH_CONFIG.REFRESH_THRESHOLD * 60; // Convert to seconds
    return payload.exp < (currentTime + refreshThreshold);
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};

// Clear all stored data (for complete logout)
export const clearAllStoredData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('Error clearing all stored data:', error);
  }
}; 