import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Базовый URL для API
export const API_BASE_URL = 'https://kpt.api.the-displaycontrol.com';

// Интерфейс для ответа API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

// Интерфейс для ошибки API
export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

// Конфигурация для axios
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Интерцептор для запросов - добавляем токен авторизации
  client.interceptors.request.use(
    async (config) => {
      try {
        console.log(`🌐 HTTP ${config.method?.toUpperCase()} ${config.url}`, {
          baseURL: config.baseURL,
          data: config.data,
          headers: config.headers
        });
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('🔑 Добавлен токен авторизации');
        } else {
          console.log('⚠️ Токен авторизации не найден');
        }
      } catch (error) {
        console.warn('Failed to get auth token:', error);
      }
      return config;
    },
    (error) => {
      console.error('❌ Ошибка интерцептора запроса:', error);
      return Promise.reject(error);
    }
  );

  // Интерцептор для ответов - обрабатываем ошибки
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`✅ HTTP ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`, {
        data: response.data
      });
      return response;
    },
    async (error) => {
      console.error(`❌ HTTP ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'NETWORK_ERROR'}`, {
        error: error.response?.data || error.message,
        status: error.response?.status
      });

      const apiError: ApiError = {
        message: error.response?.data?.message || error.message || 'Произошла ошибка',
        status: error.response?.status || 500,
        data: error.response?.data,
      };

      // Если токен истек, очищаем его и перенаправляем на логин
      if (error.response?.status === 401) {
        console.log('🔒 Токен истек, очищаем...');
        try {
          await AsyncStorage.removeItem('auth_token');
          // Здесь можно добавить логику перенаправления на экран логина
        } catch (storageError) {
          console.warn('Failed to remove auth token:', storageError);
        }
      }

      return Promise.reject(apiError);
    }
  );

  return client;
};

export const apiClient = createApiClient();

// Утилиты для работы с API
export const apiUtils = {
  // Сохранение токена
  setAuthToken: async (token: string) => {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Failed to save auth token:', error);
    }
  },

  // Удаление токена
  removeAuthToken: async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Failed to remove auth token:', error);
    }
  },

  // Получение токена
  getAuthToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  },
};

