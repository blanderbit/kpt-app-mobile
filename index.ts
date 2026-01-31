import { registerRootComponent } from 'expo';
import { revenueCatService } from './src/shared/services/revenuecat';
import { getRevenueCatApiKey } from './src/app/config/revenuecat.config';
import App from './App';

// Инициализация RevenueCat при старте приложения (до регистрации компонента)
try {
    const apiKey = getRevenueCatApiKey();
    if (apiKey && !apiKey.includes('YOUR_') && !apiKey.includes('HERE')) {
        revenueCatService.initialize({ apiKey });
    }
} catch {
    // RevenueCat init failed
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
