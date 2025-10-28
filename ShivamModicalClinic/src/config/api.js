/**
 * Shivam Medical Clinic - API Configuration
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL - update this to your backend URL
const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:5000/api' // Android emulator
  : 'http://localhost:5000/api'; // For iOS simulator use http://localhost:5000/api

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error getting token:', error);
      return config;
    }
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      // Redirect to login
    }
    return Promise.reject(error);
  },
);

export default api;