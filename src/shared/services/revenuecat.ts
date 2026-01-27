import Purchases, {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
  PurchasesStoreProduct,
} from 'react-native-purchases';
import { Platform } from 'react-native';

// Типы для конфигурации
export interface RevenueCatConfig {
  apiKey: string;
  appUserID?: string;
}

class RevenueCatService {
  private isInitialized = false;
  private pendingAppUserID?: string;

  /**
   * Инициализация RevenueCat SDK
   * @param config - Конфигурация с API ключом и опциональным userID
   */
  initialize(config: RevenueCatConfig): void {
    if (this.isInitialized) {
      console.warn('RevenueCat is already initialized');
      return;
    }

    try {
      // Определяем платформу и используем соответствующий API ключ
      // Для iOS и Android нужны разные ключи
      Purchases.configure({
        apiKey: config.apiKey,
        appUserID: config.appUserID ?? this.pendingAppUserID,
      });

      this.isInitialized = true;
      console.log('RevenueCat initialized successfully');

      // Если userID был выставлен до инициализации — применяем его сейчас
      const userIdToApply = config.appUserID ?? this.pendingAppUserID;
      if (userIdToApply) {
        // logIn возвращает customerInfo/created, но нам здесь достаточно факта привязки
        Purchases.logIn(userIdToApply).catch((e) => {
          console.warn('RevenueCat logIn after initialize failed:', e);
        });
        this.pendingAppUserID = undefined;
      }
    } catch (error) {
      console.error('Error initializing RevenueCat:', error);
      throw error;
    }
  }

  /**
   * Установка пользовательского ID
   */
  async setUserID(userID: string): Promise<void> {
    if (!this.isInitialized) {
      // App может успеть залогинить пользователя раньше, чем выполнится Purchases.configure().
      // Сохраняем и применим сразу после initialize().
      this.pendingAppUserID = userID;
      return;
    }
    try {
      await Purchases.logIn(userID);
    } catch (error) {
      console.error('Error setting user ID:', error);
      throw error;
    }
  }

  /**
   * Выход пользователя
   */
  async logout(): Promise<void> {
    if (!this.isInitialized) {
      this.pendingAppUserID = undefined;
      return;
    }
    try {
      await Purchases.logOut();
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  /**
   * Получение информации о текущем пользователе
   */
  async getCustomerInfo(): Promise<CustomerInfo> {
    try {
      return await Purchases.getCustomerInfo();
    } catch (error) {
      console.error('Error getting customer info:', error);
      throw error;
    }
  }

  /**
   * Получение доступных предложений (offerings)
   */
  async getOfferings(): Promise<PurchasesOffering | null> {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (error) {
      console.error('Error getting offerings:', error);
      throw error;
    }
  }

  /**
   * Получение всех доступных предложений
   */
  async getAllOfferings(): Promise<Record<string, PurchasesOffering>> {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.all;
    } catch (error) {
      console.error('Error getting all offerings:', error);
      throw error;
    }
  }

  /**
   * Покупка пакета
   */
  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<CustomerInfo> {
    try {
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      return customerInfo;
    } catch (error) {
      console.error('Error purchasing package:', error);
      throw error;
    }
  }

  /**
   * Покупка продукта напрямую
   */
  async purchaseProduct(product: PurchasesStoreProduct): Promise<CustomerInfo> {
    try {
      const { customerInfo } = await Purchases.purchaseStoreProduct(product);
      return customerInfo;
    } catch (error) {
      console.error('Error purchasing product:', error);
      throw error;
    }
  }

  /**
   * Восстановление покупок
   */
  async restorePurchases(): Promise<CustomerInfo> {
    try {
      return await Purchases.restorePurchases();
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    }
  }

  /**
   * Проверка, является ли пользователь подписчиком
   */
  async isSubscribed(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      const activeEntitlements = customerInfo.entitlements.active;
      // active может быть объектом или Map, проверяем оба случая
      if (activeEntitlements instanceof Map) {
        return activeEntitlements.size > 0;
      }
      return Object.keys(activeEntitlements).length > 0;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  /**
   * Получение активных entitlements
   */
  async getActiveEntitlements(): Promise<Record<string, any>> {
    try {
      const customerInfo = await this.getCustomerInfo();
      return customerInfo.entitlements.active;
    } catch (error) {
      console.error('Error getting active entitlements:', error);
      throw error;
    }
  }

  /**
   * Проверка, имеет ли пользователь конкретный entitlement
   */
  async hasEntitlement(entitlementID: string): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      return customerInfo.entitlements.active[entitlementID] !== undefined;
    } catch (error) {
      console.error('Error checking entitlement:', error);
      return false;
    }
  }

  /**
   * Получение информации о продуктах
   * @param productIdentifiers - Массив идентификаторов продуктов
   * @param type - Опциональный тип продукта (SUBSCRIPTION или NON_SUBSCRIPTION)
   */
  async getProducts(productIdentifiers: string[], type?: string): Promise<PurchasesStoreProduct[]> {
    try {
      // Второй параметр опционален, SDK автоматически определит тип по платформе
      return await Purchases.getProducts(productIdentifiers, type as any);
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  }

  /**
   * Проверка статуса инициализации
   */
  getInitialized(): boolean {
    return this.isInitialized;
  }
}

// Экспорт singleton экземпляра
export const revenueCatService = new RevenueCatService();

