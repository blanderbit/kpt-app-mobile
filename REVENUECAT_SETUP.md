# Настройка RevenueCat SDK

RevenueCat SDK успешно подключен к проекту. Следуйте инструкциям ниже для завершения настройки.

## Шаги настройки

### 1. Получение API ключей

1. Зайдите в [RevenueCat Dashboard](https://app.revenuecat.com)
2. Выберите ваш проект (или создайте новый)
3. Перейдите в **Settings > API Keys**
4. Скопируйте ключи:
   - **Public Apple API Key** (для iOS)
   - **Public Google API Key** (для Android)

### 2. Настройка API ключей

Откройте файл `src/app/config/revenuecat.config.ts` и замените плейсхолдеры на ваши реальные API ключи:

```typescript
export const REVENUECAT_API_KEYS = {
  ios: 'YOUR_IOS_API_KEY_HERE',      // Замените на ваш iOS ключ
  android: 'YOUR_ANDROID_API_KEY_HERE', // Замените на ваш Android ключ
};
```

**Важно:** Для production используйте переменные окружения или secure storage для хранения ключей.

### 3. Настройка продуктов в RevenueCat Dashboard

1. В RevenueCat Dashboard перейдите в **Products**
2. Добавьте ваши продукты и подписки
3. Настройте **Entitlements** (права доступа)
4. Создайте **Offerings** (предложения)

### 4. Настройка продуктов в App Store Connect / Google Play Console

Убедитесь, что продукты настроены в соответствующих магазинах:
- **iOS:** App Store Connect > In-App Purchases
- **Android:** Google Play Console > Monetize > Products > Subscriptions

### 5. Пересборка нативных модулей

После установки пакета необходимо пересобрать нативные модули:

**Для iOS:**
```bash
cd ios
pod install
cd ..
```

**Для Android:**
```bash
# Android автоматически подхватит зависимости через Gradle
```

**Затем пересоберите приложение:**
```bash
# Для iOS
yarn ios

# Для Android
yarn android
```

**Примечание:** `react-native-purchases` не требует Expo config plugin для bare workflow проектов. Пакет автоматически подключается через autolinking.

## Использование

### Инициализация

RevenueCat автоматически инициализируется при запуске приложения в `AppContainer.tsx`.

### Примеры использования

```typescript
import { revenueCatService } from '@shared/services/revenuecat';

// Получение текущих предложений
const offerings = await revenueCatService.getOfferings();

// Покупка пакета
if (offerings?.availablePackages) {
  const packageToPurchase = offerings.availablePackages[0];
  const customerInfo = await revenueCatService.purchasePackage(packageToPurchase);
}

// Проверка подписки
const isSubscribed = await revenueCatService.isSubscribed();

// Проверка конкретного entitlement
const hasPremium = await revenueCatService.hasEntitlement('premium');

// Восстановление покупок
const customerInfo = await revenueCatService.restorePurchases();
```

## Доступные методы

Сервис `revenueCatService` предоставляет следующие методы:

- `initialize(config)` - Инициализация SDK
- `getAppUserID()` - Получение текущего app user id из RevenueCat (для передачи на бэкенд в регистрации/логине)
- `setUserID(userID)` - Установка пользовательского ID (вызов Purchases.logIn)
- `logout()` - Выход пользователя
- `getCustomerInfo()` - Получение информации о пользователе
- `getOfferings()` - Получение текущих предложений
- `getAllOfferings()` - Получение всех предложений
- `purchasePackage(package)` - Покупка пакета
- `purchaseProduct(product)` - Покупка продукта
- `restorePurchases()` - Восстановление покупок
- `isSubscribed()` - Проверка подписки
- `getActiveEntitlements()` - Получение активных entitlements
- `hasEntitlement(entitlementID)` - Проверка конкретного entitlement
- `getProducts(productIdentifiers)` - Получение информации о продуктах

## Документация

Полная документация RevenueCat доступна по адресу:
- [RevenueCat Docs](https://www.revenuecat.com/docs)
- [React Native SDK](https://www.revenuecat.com/docs/react-native)

## Тестирование

Для тестирования покупок используйте:
- **iOS:** Sandbox тестовые аккаунты в App Store Connect
- **Android:** Тестовые аккаунты в Google Play Console

RevenueCat автоматически определяет окружение (sandbox/production) на основе используемых аккаунтов.

### Test Store (симуляция покупок)

Если в проекте включён **Test Store** (ключ `revenueCatTestStoreApiKey` в .env), покупки не идут в реальный App Store / Play Store — при нажатии «Купить» RevenueCat показывает **диалог с тремя вариантами**:

1. **Simulate successful purchase** — симуляция успешной покупки (подписка активируется).
2. **Simulate failed purchase** — симуляция ошибки оплаты (для проверки обработки ошибок в приложении).
3. **Cancel the purchase** — отмена пользователем.

Если в логах видите ошибку **«Purchase failure simulated successfully in Test Store»** — это не баг приложения. Вы (или симулятор) выбрали в диалоге «Simulate failed purchase». Чтобы успешно «купить» подписку в тесте, при появлении диалога выбирайте **«Simulate successful purchase»**.

