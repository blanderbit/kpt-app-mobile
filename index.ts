import { registerRootComponent } from 'expo';
import { revenueCatService } from './src/shared/services/revenuecat';
import { getRevenueCatApiKey, isTestStoreEnabled } from './src/app/config/revenuecat.config';
import App from './App';

// Инициализация RevenueCat при старте приложения (до регистрации компонента)
try {
    const apiKey = getRevenueCatApiKey();
    // Проверяем, что ключ не дефолтный
    if (apiKey && !apiKey.includes('YOUR_') && !apiKey.includes('HERE')) {
        revenueCatService.initialize({ apiKey });
        const mode = isTestStoreEnabled() ? 'Test Store' : 'Production';
        const keyType = apiKey.startsWith('test_') ? 'test_...' : 'appl_...';
        console.log(`[App] RevenueCat initialized — mode: ${mode}, key type: ${keyType}`);
        if (isTestStoreEnabled()) {
            console.log('[App] Using Test Store (products from RevenueCat dashboard, no App Store approval needed).');
        } else {
            console.log('[App] Note: RevenueCat warnings about products not being approved in App Store Connect are expected in development.');
        }
        console.log('[App] Products need to be approved in App Store Connect before they can be used in production.');
    } else {
        console.warn('RevenueCat API key not configured. Please set REVENUECAT_IOS_API_KEY and REVENUECAT_ANDROID_API_KEY in your environment or update revenuecat.config.ts');
    }
} catch (error) {
    console.error('Failed to initialize RevenueCat at startup:', error);
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
