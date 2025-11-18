// Временно отключено - react-native-purchases удален из проекта
// import Purchases, {
//   CustomerInfo,
//   PurchasesOffering,
//   PurchasesPackage,
//   PurchasesStoreProduct,
// } from 'react-native-purchases';
import { Platform } from 'react-native';

// Типы для конфигурации
export interface RevenueCatConfig {
  apiKey: string;
  appUserID?: string;
}

// Временно отключено - react-native-purchases удален из проекта
// class RevenueCatService {
//   private isInitialized = false;

//   /**
//    * Инициализация RevenueCat SDK
//    * @param config - Конфигурация с API ключом и опциональным userID
//    */
//   initialize(config: RevenueCatConfig): void {
//     if (this.isInitialized) {
//       console.warn('RevenueCat is already initialized');
//       return;
//     }

//     try {
//       // Определяем платформу и используем соответствующий API ключ
//       // Для iOS и Android нужны разные ключи
//       Purchases.configure({
//         apiKey: config.apiKey,
//         appUserID: config.appUserID,
//       });

//       this.isInitialized = true;
//       console.log('RevenueCat initialized successfully');
//     } catch (error) {
//       console.error('Error initializing RevenueCat:', error);
//       throw error;
//     }
//   }

//   /**
//    * Установка пользовательского ID
//    */
//   async setUserID(userID: string): Promise<void> {
//     try {
//       await Purchases.logIn(userID);
//     } catch (error) {
//       console.error('Error setting user ID:', error);
//       throw error;
//     }
//   }

//   /**
//    * Выход пользователя
//    */
//   async logout(): Promise<void> {
//     try {
//       await Purchases.logOut();
//     } catch (error) {
//       console.error('Error logging out:', error);
//       throw error;
//     }
//   }

//   /**
//    * Получение информации о текущем пользователе
//    */
//   async getCustomerInfo(): Promise<CustomerInfo> {
//     try {
//       return await Purchases.getCustomerInfo();
//     } catch (error) {
//       console.error('Error getting customer info:', error);
//       throw error;
//     }
//   }

//   /**
//    * Получение доступных предложений (offerings)
//    */
//   async getOfferings(): Promise<PurchasesOffering | null> {
//     try {
//       const offerings = await Purchases.getOfferings();
//       return offerings.current;
//     } catch (error) {
//       console.error('Error getting offerings:', error);
//       throw error;
//     }
//   }

//   /**
//    * Получение всех доступных предложений
//    */
//   async getAllOfferings(): Promise<Record<string, PurchasesOffering>> {
//     try {
//       const offerings = await Purchases.getOfferings();
//       return offerings.all;
//     } catch (error) {
//       console.error('Error getting all offerings:', error);
//       throw error;
//     }
//   }

//   /**
//    * Покупка пакета
//    */
//   async purchasePackage(packageToPurchase: PurchasesPackage): Promise<CustomerInfo> {
//     try {
//       const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
//       return customerInfo;
//     } catch (error) {
//       console.error('Error purchasing package:', error);
//       throw error;
//     }
//   }

//   /**
//    * Покупка продукта напрямую
//    */
//   async purchaseProduct(product: PurchasesStoreProduct): Promise<CustomerInfo> {
//     try {
//       const { customerInfo } = await Purchases.purchaseStoreProduct(product);
//       return customerInfo;
//     } catch (error) {
//       console.error('Error purchasing product:', error);
//       throw error;
//     }
//   }

//   /**
//    * Восстановление покупок
//    */
//   async restorePurchases(): Promise<CustomerInfo> {
//     try {
//       return await Purchases.restorePurchases();
//     } catch (error) {
//       console.error('Error restoring purchases:', error);
//       throw error;
//     }
//   }

//   /**
//    * Проверка, является ли пользователь подписчиком
//    */
//   async isSubscribed(): Promise<boolean> {
//     try {
//       const customerInfo = await this.getCustomerInfo();
//       return customerInfo.entitlements.active.size > 0;
//     } catch (error) {
//       console.error('Error checking subscription status:', error);
//       return false;
//     }
//   }

//   /**
//    * Получение активных entitlements
//    */
//   async getActiveEntitlements(): Promise<Record<string, any>> {
//     try {
//       const customerInfo = await this.getCustomerInfo();
//       return customerInfo.entitlements.active;
//     } catch (error) {
//       console.error('Error getting active entitlements:', error);
//       throw error;
//     }
//   }

//   /**
//    * Проверка, имеет ли пользователь конкретный entitlement
//    */
//   async hasEntitlement(entitlementID: string): Promise<boolean> {
//     try {
//       const customerInfo = await this.getCustomerInfo();
//       return customerInfo.entitlements.active[entitlementID] !== undefined;
//     } catch (error) {
//       console.error('Error checking entitlement:', error);
//       return false;
//     }
//   }

//   /**
//    * Получение информации о продуктах
//    * @param productIdentifiers - Массив идентификаторов продуктов
//    * @param type - Опциональный тип продукта (SUBSCRIPTION или NON_SUBSCRIPTION)
//    */
//   async getProducts(productIdentifiers: string[], type?: string): Promise<PurchasesStoreProduct[]> {
//     try {
//       // Второй параметр опционален, SDK автоматически определит тип по платформе
//       return await Purchases.getProducts(productIdentifiers, type as any);
//     } catch (error) {
//       console.error('Error getting products:', error);
//       throw error;
//     }
//   }

//   /**
//    * Проверка статуса инициализации
//    */
//   getInitialized(): boolean {
//     return this.isInitialized;
//   }
// }

// // Экспорт singleton экземпляра
// export const revenueCatService = new RevenueCatService();

// Заглушка для совместимости
class RevenueCatService {
  private isInitialized = false;

  initialize(config: RevenueCatConfig): void {
    console.warn('RevenueCat is disabled - react-native-purchases removed from project');
  }

  async setUserID(userID: string): Promise<void> {
    throw new Error('RevenueCat is disabled');
  }

  async logout(): Promise<void> {
    throw new Error('RevenueCat is disabled');
  }

  async getCustomerInfo(): Promise<any> {
    throw new Error('RevenueCat is disabled');
  }

  async getOfferings(): Promise<any> {
    throw new Error('RevenueCat is disabled');
  }

  async getAllOfferings(): Promise<any> {
    throw new Error('RevenueCat is disabled');
  }

  async purchasePackage(packageToPurchase: any): Promise<any> {
    throw new Error('RevenueCat is disabled');
  }

  async purchaseProduct(product: any): Promise<any> {
    throw new Error('RevenueCat is disabled');
  }

  async restorePurchases(): Promise<any> {
    throw new Error('RevenueCat is disabled');
  }

  async isSubscribed(): Promise<boolean> {
    return false;
  }

  async getActiveEntitlements(): Promise<Record<string, any>> {
    return {};
  }

  async hasEntitlement(entitlementID: string): Promise<boolean> {
    return false;
  }

  async getProducts(productIdentifiers: string[], type?: string): Promise<any[]> {
    return [];
  }

  getInitialized(): boolean {
    return false;
  }
}

// Экспорт singleton экземпляра
export const revenueCatService = new RevenueCatService();

