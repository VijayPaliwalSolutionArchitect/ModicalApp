/**
 * Shivam Medical Clinic - API Configuration (Expo Compatible)
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// API Base URL Configuration for Expo
// Change this to your computer's local IP when testing on physical device
const getApiBaseUrl = () => {
  // For development with Expo Go
  if (__DEV__) {
    // Option 1: Use your computer's local IP (recommended for physical devices)
    // Find your IP: 
    //   - macOS/Linux: ifconfig | grep "inet " | grep -v 127.0.0.1
    //   - Windows: ipconfig
    // Then replace 'localhost' with your IP, e.g., 'http://192.168.1.100:5000/api'
    
    const LOCAL_IP = 'localhost'; // Change to your IP: e.g., '192.168.1.100'
    
    if (Platform.OS === 'android' && LOCAL_IP === 'localhost') {
      // Android emulator
      return 'http://10.0.2.2:5000/api';
    } else if (LOCAL_IP !== 'localhost') {
      // Physical device or custom IP
      return `http://${LOCAL_IP}:5000/api`;
    } else {
      // iOS simulator or web
      return 'http://localhost:5000/api';
    }
  }
  
  // Production URL
  return 'https://your-production-api.com/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL);

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