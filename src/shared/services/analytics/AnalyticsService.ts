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
      // Если уже инициализирован, но передан новый email, обновляем его
      if (userEmail) {
        this.setUser(userEmail);
      }
      return;
    }

    try {
      await init(AMPLITUDE_API_KEY, userEmail || '', { disableCookies: true }).promise;

      this.isInitialized = true;
      // Устанавливаем email как userId сразу после инициализации, если он передан
      if (userEmail) {
        this.setUser(userEmail);
      }
    } catch {
      // ignore
    }
  }

  /**
   * Отправка события
   * @param eventName - Название события
   * @param properties - Свойства события (опционально)
   */
  trackEvent(eventName: string, properties?: AnalyticsEventProperties): void {
    if (!this.isInitialized) return;
    try {
      track(eventName, properties);
    } catch {
      // ignore
    }
  }

  /**
   * Установка идентификатора пользователя
   * @param userId - ID пользователя
   */
  setUser(userId: string | null): void {
    if (!this.isInitialized) return;
    try {
      setUserId(userId);
    } catch {
      // ignore
    }
  }

  /**
   * Установка свойств пользователя
   * @param properties - Свойства пользователя
   */
  setUserProperties(properties: UserProperties): void {
    if (!this.isInitialized) return;
    try {
      const identifyObj = new Identify();
      Object.keys(properties).forEach((key) => {
        const value = properties[key];
        if (value !== null && value !== undefined) {
          identifyObj.set(key, value);
        }
      });
      identify(identifyObj);
    } catch {
      // ignore
    }
  }

  /**
   * Добавление свойства пользователя (добавляет к существующим)
   * @param property - Название свойства
   * @param value - Значение
   */
  addUserProperty(property: string, value: string | number | boolean): void {
    if (!this.isInitialized) return;
    try {
      const identifyObj = new Identify();
      identifyObj.set(property, value);
      identify(identifyObj);
    } catch {
      // ignore
    }
  }

  /**
   * Установка группы пользователя
   * @param groupType - Тип группы
   * @param groupName - Название группы
   */
  setUserGroup(groupType: string, groupName: string): void {
    if (!this.isInitialized) return;
    try {
      setGroup(groupType, groupName);
    } catch {
      // ignore
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
    if (!this.isInitialized) return;
    try {
      track('Revenue', undefined, { revenue });
    } catch {
      // ignore
    }
  }

  /**
   * Принудительная отправка всех накопленных событий
   */
  async flush(): Promise<void> {
    if (!this.isInitialized) return;
    try {
      await flush().promise;
    } catch {
      // ignore
    }
  }

  /**
   * Очистка данных пользователя (при выходе)
   */
  clearUser(): void {
    if (!this.isInitialized) return;
    try {
      setUserId(null);
    } catch {
      // ignore
    }
  }
}

export const amplitudeAnalyticsService = new AmplitudeAnalyticsService();

