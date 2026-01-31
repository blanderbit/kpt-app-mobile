import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
  PurchasesStoreProduct,
} from 'react-native-purchases';

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
      return;
    }

    try {
      Purchases.configure({
        apiKey: config.apiKey,
        appUserID: config.appUserID ?? this.pendingAppUserID,
      });

      this.isInitialized = true;

      // Лог для бэкенда: ровно строка app_user_id (RC SDK)
      Purchases.getAppUserID().then((appUserId) => {
        console.log('[RC Backend Check] app_user_id:', appUserId);
      });

      const userIdToApply = config.appUserID ?? this.pendingAppUserID;
      if (userIdToApply) {
        Purchases.logIn(userIdToApply).catch(() => {});
        this.pendingAppUserID = undefined;
      }
    } catch (error) {
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
      throw error;
    }
  }

  /**
   * Получение текущего app user id из RevenueCat.
   * До регистрации/логина это обычно анонимный ID вида $RCAnonymousID:...
   * После logIn — наш backend user id (строка).
   * Доступен после инициализации SDK (Purchases.configure).
   */
  async getAppUserID(): Promise<string | null> {
    if (!this.isInitialized) {
      return null;
    }
    try {
      return await Purchases.getAppUserID();
    } catch {
      return null;
    }
  }

  /**
   * Получение информации о текущем пользователе
   */
  async getCustomerInfo(): Promise<CustomerInfo> {
    return await Purchases.getCustomerInfo();
  }

  /**
   * URL для управления подпиской (App Store / Play Store).
   * Открытие этого URL ведёт пользователя в настройки подписки, где можно отменить или изменить план.
   * @returns URL или null, если подписки нет / платформа не поддерживается
   */
  async getManagementURL(): Promise<string | null> {
    try {
      const customerInfo = await this.getCustomerInfo();
      const info = customerInfo as CustomerInfo & { managementURL?: string | null };
      return info.managementURL ?? null;
    } catch {
      return null;
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
      throw error;
    }
  }

  /**
   * Покупка пакета
   */
  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<CustomerInfo> {
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    return customerInfo;
  }

  /**
   * Покупка продукта напрямую
   */
  async purchaseProduct(product: PurchasesStoreProduct): Promise<CustomerInfo> {
    const { customerInfo } = await Purchases.purchaseStoreProduct(product);
    return customerInfo;
  }

  /**
   * Восстановление покупок
   */
  async restorePurchases(): Promise<CustomerInfo> {
    return await Purchases.restorePurchases();
  }

  /**
   * Лог для бэкенда после покупки: app_user_id, время, платформа, getCustomerInfo (entitlements).
   * Вызывать сразу после успешного purchasePackage/purchaseProduct.
   */
  async logPurchaseForBackend(customerInfo: CustomerInfo): Promise<void> {
    const appUserId = await this.getAppUserID();
    const purchaseTime = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    const platform = Platform.OS === 'ios' ? 'iOS' : 'Android';
    const active = customerInfo.entitlements.active;
    const activeKeys = typeof active === 'object' && active !== null
      ? (active instanceof Map ? Array.from(active.keys()) : Object.keys(active))
      : [];
    const activeSnapshot = active instanceof Map ? Object.fromEntries(active) : active;
    console.log('[RC Backend Check] app_user_id:', appUserId);
    console.log('[RC Backend Check] purchase_time:', purchaseTime);
    console.log('[RC Backend Check] platform:', platform);
    console.log('[RC Backend Check] getCustomerInfo (after purchase) — entitlements.active:', JSON.stringify({ activeEntitlementIds: activeKeys, active: activeSnapshot }, null, 2));
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
    } catch {
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
    } catch {
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
      const products = await Purchases.getProducts(productIdentifiers, type as any);

      return products;
    } catch (error: any) {
      if (error?.message?.includes('configuration') || error?.message?.includes('App Store Connect')) {
        return [];
      }
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

