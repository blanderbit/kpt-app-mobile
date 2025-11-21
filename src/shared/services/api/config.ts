import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Базовый URL для API
export const API_BASE_URL = 'https://api.plesury.com';

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

// Функция для обновления токенов
const refreshTokens = async (): Promise<boolean> => {
  try {
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    const accessToken = await AsyncStorage.getItem('auth_token');
    
    if (!refreshToken || !accessToken) {
      return false;
    }

    // Используем динамический импорт, чтобы избежать циклических зависимостей
    const { authService } = await import('./client');
    const response = await authService.refreshToken({
      refreshToken,
      accessToken,
    });

    // Сохраняем новые токены
    await apiUtils.setAuthTokens(response.accessToken, response.refreshToken);
    
    return true;
  } catch (error: any) {
    // Если refresh не удался, очищаем все токены
    await apiUtils.removeAuthTokens();
    
    // Уведомляем о необходимости логина
    notifyAuthRequired();
    
    return false;
  }
};

// Флаг для предотвращения множественных попыток refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

// Функция для обработки очереди неудачных запросов
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

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
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        // Игнорируем ошибки получения токена
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Интерцептор для ответов - обрабатываем ошибки и автоматически обновляем токены
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      // Если получили 401 и это не refresh запрос
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Если уже идет процесс refresh, добавляем запрос в очередь
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return client(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const success = await refreshTokens();
          
          if (success) {
            // Получаем новый токен
            const newToken = await AsyncStorage.getItem('auth_token');
            
            // Обрабатываем очередь
            processQueue(null, newToken);
            
            // Повторяем оригинальный запрос с новым токеном
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            
            return client(originalRequest);
          } else {
            // Refresh не удался, очищаем все и возвращаем ошибку
            processQueue(error, null);
            throw error;
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      }

      const apiError: ApiError = {
        message: error.response?.data?.message || error.message || 'Произошла ошибка',
        status: error.response?.status || 500,
        data: error.response?.data,
      };

      return Promise.reject(apiError);
    }
  );

  return client;
};

export const apiClient = createApiClient();

// Утилиты для работы с API
export const apiUtils = {
  // Сохранение токенов
  setAuthTokens: async (accessToken: string, refreshToken: string) => {
    try {
      await AsyncStorage.multiSet([
        ['auth_token', accessToken],
        ['refresh_token', refreshToken],
      ]);
    } catch (error) {
      // Игнорируем ошибки сохранения токенов
    }
  },

  // Сохранение только access токена
  setAuthToken: async (token: string) => {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      // Игнорируем ошибки сохранения токена
    }
  },

  // Получение access токена
  getAuthToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      return null;
    }
  },

  // Получение refresh токена
  getRefreshToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('refresh_token');
    } catch (error) {
      return null;
    }
  },

  // Удаление всех токенов
  removeAuthTokens: async () => {
    try {
      await AsyncStorage.multiRemove(['auth_token', 'refresh_token']);
    } catch (error) {
      // Игнорируем ошибки удаления токенов
    }
  },

  // Удаление только access токена
  removeAuthToken: async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      // Игнорируем ошибки удаления токена
    }
  },

  // Проверка наличия токенов
  hasTokens: async (): Promise<boolean> => {
    try {
      const accessToken = await AsyncStorage.getItem('auth_token');
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      return !!(accessToken && refreshToken);
    } catch (error) {
      return false;
    }
  },
};

// Callback для уведомления о необходимости логина
let onAuthRequiredCallback: (() => void) | null = null;

// Функция для установки callback'а
export const setOnAuthRequired = (callback: (() => void) | null) => {
  onAuthRequiredCallback = callback;
};

// Функция для вызова callback'а
export const notifyAuthRequired = () => {
  if (onAuthRequiredCallback) {
    onAuthRequiredCallback();
  }
};

