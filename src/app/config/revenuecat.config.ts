import { Platform } from 'react-native';

/**
 * Конфигурация RevenueCat
 * 
 * Для получения API ключей:
 * 1. Зайдите в RevenueCat Dashboard (https://app.revenuecat.com)
 * 2. Выберите ваш проект
 * 3. Перейдите в Settings > API Keys
 * 4. Скопируйте ключи для iOS и Android
 * 
 * ВАЖНО: Не коммитьте реальные ключи в репозиторий!
 * Используйте переменные окружения или secure storage для production.
 */

// API ключи RevenueCat
// Для iOS и Android нужны разные ключи
export const REVENUECAT_API_KEYS = {
  ios: process.env.REVENUECAT_IOS_API_KEY || 'YOUR_IOS_API_KEY_HERE',
  android: process.env.REVENUECAT_ANDROID_API_KEY || 'YOUR_ANDROID_API_KEY_HERE',
};

/**
 * Получение API ключа для текущей платформы
 */
export const getRevenueCatApiKey = (): string => {
  if (Platform.OS === 'ios') {
    return REVENUECAT_API_KEYS.ios;
  } else if (Platform.OS === 'android') {
    return REVENUECAT_API_KEYS.android;
  }
  // Для других платформ (web) можно вернуть дефолтный ключ
  return REVENUECAT_API_KEYS.ios;
};

