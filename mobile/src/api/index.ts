import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const api = axios.create({
  baseURL: 'https://pcplace-backend.onrender.com/api',
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('pcplace_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
