import { init, track, setUserId, identify, Identify, setGroup, flush, Revenue } from '@amplitude/analytics-react-native';
import { Platform } from 'react-native';

const AMPLITUDE_API_KEY = '5742341c0b018dd9d96fb5a2d1235da1';
const AMPLITUDE_SECRET = 'b835ad93418730eb4c174cdc419a2bb3';

export interface AnalyticsEventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

export interface UserProperties {
  [key: string]: string | number | boolean | null | undefined;
}

class AmplitudeAnalyticsService {
  private isInitialized: boolean = false;

  /**
   * Инициализация Amplitude Analytics
   * @param userEmail - Email пользователя (опционально)
   */
  async initialize(userEmail?: string): Promise<void> {
    if (this.isInitialized) {
      console.log('[Analytics] Already initialized');
      // Если уже инициализирован, но передан новый email, обновляем его
      if (userEmail) {
        this.setUser(userEmail);
      }
      return;
    }

    try {
      await init(AMPLITUDE_API_KEY, userEmail || '', { disableCookies: true }).promise;

      this.isInitialized = true;
      console.log('[Analytics] Amplitude initialized successfully');
      
      // Устанавливаем email как userId сразу после инициализации, если он передан
      if (userEmail) {
        this.setUser(userEmail);
      }
    } catch (error) {
      console.error('[Analytics] Failed to initialize Amplitude:', error);
    }
  }

  /**
   * Отправка события
   * @param eventName - Название события
   * @param properties - Свойства события (опционально)
   */
  trackEvent(eventName: string, properties?: AnalyticsEventProperties): void {
    if (!this.isInitialized) {
      console.warn('[Analytics] Not initialized. Call initialize() first.');
      return;
    }

    try {
      track(eventName, properties);
      console.log(`[Analytics] Event tracked: ${eventName}`, properties);
    } catch (error) {
      console.error(`[Analytics] Failed to track event ${eventName}:`, error);
    }
  }

  /**
   * Установка идентификатора пользователя
   * @param userId - ID пользователя
   */
  setUser(userId: string | null): void {
    if (!this.isInitialized) {
      console.warn('[Analytics] Not initialized. Call initialize() first.');
      return;
    }

    try {
      setUserId(userId);
      console.log(`[Analytics] User ID set: ${userId}`);
    } catch (error) {
      console.error('[Analytics] Failed to set user ID:', error);
    }
  }

  /**
   * Установка свойств пользователя
   * @param properties - Свойства пользователя
   */
  setUserProperties(properties: UserProperties): void {
    if (!this.isInitialized) {
      console.warn('[Analytics] Not initialized. Call initialize() first.');
      return;
    }

    try {
      const identifyObj = new Identify();
      Object.keys(properties).forEach((key) => {
        const value = properties[key];
        if (value !== null && value !== undefined) {
          identifyObj.set(key, value);
        }
      });
      identify(identifyObj);
      console.log('[Analytics] User properties set:', properties);
    } catch (error) {
      console.error('[Analytics] Failed to set user properties:', error);
    }
  }

  /**
   * Добавление свойства пользователя (добавляет к существующим)
   * @param property - Название свойства
   * @param value - Значение
   */
  addUserProperty(property: string, value: string | number | boolean): void {
    if (!this.isInitialized) {
      console.warn('[Analytics] Not initialized. Call initialize() first.');
      return;
    }

    try {
      const identifyObj = new Identify();
      identifyObj.set(property, value);
      identify(identifyObj);
      console.log(`[Analytics] User property added: ${property} = ${value}`);
    } catch (error) {
      console.error(`[Analytics] Failed to add user property ${property}:`, error);
    }
  }

  /**
   * Установка группы пользователя
   * @param groupType - Тип группы
   * @param groupName - Название группы
   */
  setUserGroup(groupType: string, groupName: string): void {
    if (!this.isInitialized) {
      console.warn('[Analytics] Not initialized. Call initialize() first.');
      return;
    }

    try {
      setGroup(groupType, groupName);
      console.log(`[Analytics] User group set: ${groupType} = ${groupName}`);
    } catch (error) {
      console.error('[Analytics] Failed to set user group:', error);
    }
  }

  /**
   * Отслеживание экрана
   * @param screenName - Название экрана
   * @param properties - Дополнительные свойства (опционально)
   */
  trackScreen(screenName: string, properties?: AnalyticsEventProperties): void {
    this.trackEvent('Screen Viewed', {
      screen_name: screenName,
      ...properties,
    });
  }

  /**
   * Отслеживание покупки/транзакции
   * @param revenue - Объект с данными о покупке
   */
  trackRevenue(revenue: Revenue): void {
    if (!this.isInitialized) {
      console.warn('[Analytics] Not initialized. Call initialize() first.');
      return;
    }

    try {
      track('Revenue', undefined, { revenue });
      console.log('[Analytics] Revenue tracked:', revenue);
    } catch (error) {
      console.error('[Analytics] Failed to track revenue:', error);
    }
  }

  /**
   * Принудительная отправка всех накопленных событий
   */
  async flush(): Promise<void> {
    if (!this.isInitialized) {
      console.warn('[Analytics] Not initialized. Call initialize() first.');
      return;
    }

    try {
      await flush().promise;
      console.log('[Analytics] Events flushed');
    } catch (error) {
      console.error('[Analytics] Failed to flush events:', error);
    }
  }

  /**
   * Очистка данных пользователя (при выходе)
   */
  clearUser(): void {
    if (!this.isInitialized) {
      console.warn('[Analytics] Not initialized. Call initialize() first.');
      return;
    }

    try {
      setUserId(null);
      console.log('[Analytics] User data cleared');
    } catch (error) {
      console.error('[Analytics] Failed to clear user data:', error);
    }
  }
}

export const amplitudeAnalyticsService = new AmplitudeAnalyticsService();

