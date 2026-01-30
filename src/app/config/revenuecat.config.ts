import { Platform } from 'react-native';
import Constants from 'expo-constants';

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
 * Используйте переменные окружения через .env файл.
 * 
 * Ключи читаются из:
 * - .env файла (через app.config.js)
 * - Или из process.env (для development)
 */

// API ключи RevenueCat
// Для iOS и Android нужны разные ключи
// Сначала пытаемся получить из expo-constants (из app.config.js extra), затем из process.env, затем fallback
const getEnvVar = (key: string, fallback: string): string => {
  // Пытаемся получить из expo-constants (из app.config.js extra)
  const fromConstants = Constants.expoConfig?.extra?.[key] || Constants.manifest?.extra?.[key];
  if (fromConstants) return fromConstants;
  
  // Пытаемся получить из process.env (для development/build time)
  if (process.env[key]) return process.env[key];
  
  // Fallback значение
  return fallback;
};

export const REVENUECAT_API_KEYS = {
  ios: getEnvVar('revenueCatIosApiKey', 'appl_lrfmlulrWkgYtaSkhYICqVqFiSH'),
  android: getEnvVar('revenueCatAndroidApiKey', 'YOUR_ANDROID_API_KEY_HERE'),
  /** Test Store — один ключ для всех платформ, продукты и цены из RevenueCat без App Store */
  testStore: getEnvVar('revenueCatTestStoreApiKey', ''),
};

/**
 * Используется ли Test Store (ключ задан в env).
 * В dev с Test Store ключом можно получать продукты/цены до апрува в App Store.
 */
export const isTestStoreEnabled = (): boolean => {
  return Boolean(REVENUECAT_API_KEYS.testStore);
};

/**
 * Получение API ключа для текущей платформы.
 * Если задан REVENUECAT_TEST_STORE_API_KEY — используется он (Test Store для dev).
 * В production всегда используйте только платформенные ключи.
 */
export const getRevenueCatApiKey = (): string => {
  if (REVENUECAT_API_KEYS.testStore) {
    return REVENUECAT_API_KEYS.testStore;
  }
  if (Platform.OS === 'ios') {
    return REVENUECAT_API_KEYS.ios;
  }
  if (Platform.OS === 'android') {
    return REVENUECAT_API_KEYS.android;
  }
  return REVENUECAT_API_KEYS.ios;
};

/**
 * Идентификаторы продуктов подписки
 * Соответствуют продуктам, настроенным в RevenueCat Dashboard
 */
export const REVENUECAT_PRODUCT_IDS = {
  MONTHLY: 'plesury.monthly',
  MONTHLY_TRIAL: 'plesury.monthly_trial',
  YEARLY: 'plesury.yearly',
} as const;

/**
 * Массив всех идентификаторов продуктов
 */
export const REVENUECAT_PRODUCT_IDENTIFIERS = [
  REVENUECAT_PRODUCT_IDS.MONTHLY,
  REVENUECAT_PRODUCT_IDS.MONTHLY_TRIAL,
  REVENUECAT_PRODUCT_IDS.YEARLY,
] as const;


