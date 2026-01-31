import * as Notifications from 'expo-notifications';
import { Platform, AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../api/client';
import { apiUtils } from '../api/config';

const DEVICE_TOKEN_KEY = 'push_device_token';

/**
 * Сервис для управления push-нотификациями
 * Работает только на iOS
 */
export class NotificationService {
  private appStateListener: any = null;
  private lastPermissionStatus: string | null = null;

  /**
   * Запрашивает разрешения на нотификации, если они еще не были запрошены
   * @returns Promise с статусом разрешений
   */
  async requestPermissionsIfNeeded(): Promise<string> {
    // Работаем только на iOS
    if (Platform.OS !== 'ios') return 'denied';

    try {
      // Проверяем текущий статус разрешений
      const { status: currentStatus } = await Notifications.getPermissionsAsync();
      
      // Если разрешения уже предоставлены или отклонены, возвращаем текущий статус
      if (currentStatus === 'granted' || currentStatus === 'denied') {
        this.lastPermissionStatus = currentStatus;
        return currentStatus;
      }

      // Если разрешения еще не запрашивались (undetermined), запрашиваем их
      if (currentStatus === 'undetermined') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        this.lastPermissionStatus = newStatus;
        return newStatus;
      }

      // Для других статусов (например, 'blocked') возвращаем текущий статус
      this.lastPermissionStatus = currentStatus;
      return currentStatus;
    } catch {
      return 'denied';
    }
  }

  /**
   * Регистрирует устройство для получения push-нотификаций
   * Вызывается при каждом старте приложения
   * Регистрация происходит только если пользователь авторизован и разрешения предоставлены
   */
  async registerDevice(): Promise<void> {
    // Работаем только на iOS
    if (Platform.OS !== 'ios') return;

    try {
      // Проверяем, что пользователь авторизован
      const hasTokens = await apiUtils.hasTokens();
      if (!hasTokens) return;

      // Запрашиваем разрешения, если они еще не были запрошены
      const permissionStatus = await this.requestPermissionsIfNeeded();
      
      // Регистрируем устройство только если разрешения предоставлены
      if (permissionStatus !== 'granted') return;

      // Получаем токен устройства
      const tokenResponse = await Notifications.getDevicePushTokenAsync();
      const deviceToken = tokenResponse.data;

      if (!deviceToken) return;

      // Сохраняем токен локально
      await AsyncStorage.setItem(DEVICE_TOKEN_KEY, deviceToken);

      // Регистрируем токен на сервере
      try {
        await authService.registerDeviceToken({
          token: deviceToken,
          platform: Platform.OS,
        });
      } catch {
        // Не выбрасываем ошибку, чтобы не блокировать запуск приложения
      }
    } catch {
      // Не выбрасываем ошибку, чтобы не блокировать запуск приложения
    }
  }

  /**
   * Удаляет регистрацию устройства для push-нотификаций
   * Вызывается при логауте, удалении приложения или отключении нотификаций
   */
  async unregisterDevice(): Promise<void> {
    // Работаем только на iOS
    if (Platform.OS !== 'ios') return;

    try {
      // Получаем сохраненный токен
      const deviceToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY);

      if (!deviceToken) {
        await AsyncStorage.removeItem(DEVICE_TOKEN_KEY);
        return;
      }

      // Удаляем токен на сервере
      try {
        await authService.deleteDeviceToken(deviceToken);
      } catch {
        // Продолжаем удаление локального токена даже если серверный запрос не удался
      }

      // Удаляем токен из локального хранилища
      await AsyncStorage.removeItem(DEVICE_TOKEN_KEY);
      this.lastPermissionStatus = null;
    } catch {
      try {
        await AsyncStorage.removeItem(DEVICE_TOKEN_KEY);
        this.lastPermissionStatus = null;
      } catch {
        // ignore
      }
    }
  }

  /**
   * Проверяет изменения разрешений и обрабатывает их
   * Вызывается при возврате приложения в активное состояние
   */
  private async checkPermissionChanges(): Promise<void> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      const hasTokens = await apiUtils.hasTokens();
      const storedToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY);
      
      if (status === 'granted') {
        if (hasTokens) {
          if (!storedToken || this.lastPermissionStatus !== status) {
            await this.registerDevice();
          }
        }
      } else if (this.lastPermissionStatus === 'granted' && status !== 'granted') {
        await this.unregisterDevice();
      } else if (status !== 'granted' && storedToken) {
        await AsyncStorage.removeItem(DEVICE_TOKEN_KEY);
      }
      
      // Обновляем последний известный статус
      this.lastPermissionStatus = status;
    } catch {
      // ignore
    }
  }

  /**
   * Устанавливает слушатель изменений разрешений на нотификации
   * При отключении нотификаций в настройках устройства удаляет регистрацию
   */
  setupPermissionsListener(): void {
    // Работаем только на iOS
    if (Platform.OS !== 'ios') {
      return;
    }

    // Удаляем предыдущий слушатель, если он есть
    if (this.appStateListener) {
      this.appStateListener.remove();
      this.appStateListener = null;
    }

    // Инициализируем текущий статус разрешений
    Notifications.getPermissionsAsync().then(({ status }) => {
      this.lastPermissionStatus = status;
    });

    // Устанавливаем слушатель изменений состояния приложения
    // Когда приложение возвращается в активное состояние, проверяем разрешения
    this.appStateListener = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // При возврате приложения в активное состояние проверяем изменения разрешений
        await this.checkPermissionChanges();
      }
    });
  }

  /**
   * Удаляет слушатель изменений разрешений
   */
  removePermissionsListener(): void {
    if (this.appStateListener) {
      this.appStateListener.remove();
      this.appStateListener = null;
    }
    this.lastPermissionStatus = null;
  }
}

// Экспортируем singleton экземпляр
export const notificationService = new NotificationService();


