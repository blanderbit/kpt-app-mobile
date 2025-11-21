import appsFlyer from 'react-native-appsflyer';
import { Platform, Linking } from 'react-native';

// Конфигурация AppsFlyer
// TODO: Замените на ваши реальные ключи
const APPSFLYER_DEV_KEY = 'wt6KzdXRMkeC3sMWMVqMKZ';
const APPSFLYER_APP_ID_IOS = '6755445246';
const APPSFLYER_APP_ID_ANDROID = 'YOUR_ANDROID_APP_ID';

// OneLink ID - получите из AppsFlyer панели
const ONELINK_ID = 'YOUR_ONELINK_ID';

export interface AppsFlyerDeepLinkData {
  deep_link_value?: string;
  campaign?: string;
  media_source?: string;
  [key: string]: any;
}

type DeepLinkCallback = (deepLink: string | null, data: AppsFlyerDeepLinkData | null) => void;

class AppsFlyerService {
  private isInitialized = false;
  private deepLinkCallback: DeepLinkCallback | null = null;

  /**
   * Инициализация AppsFlyer SDK
   * @param onDeepLink - Callback для обработки deep links от AppsFlyer
   */
  initialize(onDeepLink?: DeepLinkCallback): void {
    if (this.isInitialized) {
      console.warn('[AppsFlyer] Service already initialized');
      return;
    }

    try {
      const appId = Platform.OS === 'ios' ? APPSFLYER_APP_ID_IOS : APPSFLYER_APP_ID_ANDROID;

      // Проверяем, что ключи настроены
      if (APPSFLYER_DEV_KEY.includes('YOUR_') || appId.includes('YOUR_')) {
        console.warn('[AppsFlyer] API keys not configured. Please update AppsFlyerService.ts');
        return;
      }

      // Сохраняем callback
      if (onDeepLink) {
        this.deepLinkCallback = onDeepLink;
      }

      // Инициализация SDK
      appsFlyer.initSdk(
        {
          devKey: APPSFLYER_DEV_KEY,
          appId: appId,
          isDebug: __DEV__,
          onInstallConversionDataListener: true,
          onDeepLinkListener: true,
          timeToWaitForATTUserAuthorization: 10,
        },
        (result) => {
          console.log('[AppsFlyer] Initialization result:', result);
          this.isInitialized = true;
          
          // Настраиваем listeners после успешной инициализации
          this.setupListeners();
        },
        (error) => {
          console.error('[AppsFlyer] Initialization error:', error);
        }
      );
    } catch (error) {
      console.error('[AppsFlyer] Failed to initialize:', error);
    }
  }

  /**
   * Настройка listeners для AppsFlyer
   */
  private setupListeners(): void {
    // Обработка данных конверсии (установка приложения)
    appsFlyer.onInstallConversionData((data) => {
      console.log('[AppsFlyer] Install conversion data:', data);
      // Обрабатываем deep link из данных конверсии, если он есть
      if (data?.is_first_launch && data?.deep_link_value) {
        this.handleDeepLink(data);
      }
    });

    // Обработка deep links
    appsFlyer.onDeepLink((data) => {
      console.log('[AppsFlyer] Deep link received:', data);
      this.handleDeepLink(data);
    });

    // Обработка атрибуции при открытии приложения
    appsFlyer.onAppOpenAttribution((data) => {
      console.log('[AppsFlyer] App open attribution:', data);
      this.handleDeepLink(data);
    });
  }

  /**
   * Обработка deep link от AppsFlyer
   */
  private handleDeepLink(data: any): void {
    try {
      const deepLinkValue = data?.deep_link_value || data?.deepLinkValue;
      const deepLinkData: AppsFlyerDeepLinkData = {
        deep_link_value: deepLinkValue,
        campaign: data?.campaign,
        media_source: data?.media_source,
        ...data,
      };

      // Если есть deep link, открываем его через Linking
      if (deepLinkValue) {
        Linking.openURL(deepLinkValue).catch((err) => {
          console.error('[AppsFlyer] Failed to open deep link:', err);
        });
      }

      // Вызываем callback
      if (this.deepLinkCallback) {
        this.deepLinkCallback(deepLinkValue || null, deepLinkData);
      }
    } catch (error) {
      console.error('[AppsFlyer] Error handling deep link:', error);
    }
  }

  /**
   * Генерация AppsFlyer OneLink URL
   * @param deepLink - Ваш deep link (например, "plesury://article?id=123")
   * @param params - Дополнительные параметры кампании
   * @returns AppsFlyer OneLink URL
   */
  generateOneLink(deepLink: string, params: Record<string, string> = {}): string {
    if (ONELINK_ID.includes('YOUR_')) {
      console.warn('[AppsFlyer] OneLink ID not configured. Returning original deep link.');
      return deepLink;
    }

    const baseUrl = `https://app.appsflyer.com/${ONELINK_ID}`;
    const queryParams = new URLSearchParams({
      deep_link_value: deepLink,
      ...params,
    });

    return `${baseUrl}?${queryParams.toString()}`;
  }

  /**
   * Логирование события в AppsFlyer
   * @param eventName - Название события
   * @param eventValues - Параметры события
   */
  logEvent(eventName: string, eventValues: Record<string, any> = {}): void {
    if (!this.isInitialized) {
      console.warn('[AppsFlyer] Service not initialized. Cannot log event.');
      return;
    }

    try {
      appsFlyer.logEvent(eventName, eventValues, (result) => {
        console.log(`[AppsFlyer] Event logged: ${eventName}`, result);
      }, (error) => {
        console.error(`[AppsFlyer] Failed to log event ${eventName}:`, error);
      });
    } catch (error) {
      console.error(`[AppsFlyer] Error logging event ${eventName}:`, error);
    }
  }

  /**
   * Установка пользовательских данных
   * @param userId - ID пользователя
   * @param userData - Данные пользователя
   */
  setUserData(userId: string, userData: Record<string, any> = {}): void {
    if (!this.isInitialized) {
      console.warn('[AppsFlyer] Service not initialized. Cannot set user data.');
      return;
    }

    try {
      // Установка customer user ID
      appsFlyer.setCustomerUserId(userId);

      // Установка дополнительных данных пользователя
      if (Object.keys(userData).length > 0) {
        appsFlyer.setAdditionalData(userData);
      }
    } catch (error) {
      console.error('[AppsFlyer] Error setting user data:', error);
    }
  }

  /**
   * Получение AppsFlyer UID
   */
  getAppsFlyerUID(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized) {
        reject(new Error('AppsFlyer service not initialized'));
        return;
      }

      appsFlyer.getAppsFlyerUID((uid) => {
        resolve(uid);
      }, (error) => {
        reject(error);
      });
    });
  }
}

export const appsFlyerService = new AppsFlyerService();
