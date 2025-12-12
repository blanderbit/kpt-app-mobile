import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Маппинг языков: если система на украинском (uk), используем ua для бекенда
const LANGUAGE_MAP: Record<string, string> = {
    uk: 'ua', // Украинский (uk) -> украинский (ua) для бекенда
    ua: 'ua', // Украинский (ua)
    en: 'en',
    ru: 'ru',
};

// Поддерживаемые языки
const SUPPORTED_LANGUAGES = ['en', 'ru', 'ua'];

/**
 * Нормализует код языка устройства
 * Если система на украинском (uk), используем ua для получения переводов с бекенда
 */
function normalizeLanguageCode(code: string): string {
    const normalized = code.toLowerCase();
    // Если украинский язык (uk), возвращаем ua для бекенда
    if (normalized === 'uk') {
        return 'ua';
    }
    return LANGUAGE_MAP[normalized] || (SUPPORTED_LANGUAGES.includes(normalized) ? normalized : 'en');
}

/**
 * Загружает переводы с бекенда для указанного языка
 */
async function loadTranslationsFromBackend(languageCode: string): Promise<Record<string, any>> {
    try {
        console.log(`🌐 [i18n] ⬇️  Loading translations from backend for language: ${languageCode}`);
        const { languageService } = await import('@shared/services/api');
        const translations = await languageService.getTranslationsByCode(languageCode);
        console.log(`🌐 [i18n] ✅ Translations successfully loaded from backend for language: ${languageCode}`);
        return translations;
    } catch (error) {
        console.error(`🌐 [i18n] ❌ Failed to load translations from backend for ${languageCode}:`, error);
        throw error;
    }
}

/**
 * Инициализирует i18n с переводами с бекенда
 */
async function initializeI18n() {
    const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
    const normalizedLanguage = normalizeLanguageCode(deviceLanguage);
    
    console.log(`🌐 [i18n] 📱 Device language: ${deviceLanguage}`);
    console.log(`🌐 [i18n] 🔄 Normalized language code: ${normalizedLanguage}`);
    console.log(`🌐 [i18n] 🎯 TARGET LANGUAGE: ${normalizedLanguage.toUpperCase()} (will be loaded from backend)`);

    // Загружаем переводы с бекенда для нужного языка
    let translations: Record<string, any>;
    try {
        translations = await loadTranslationsFromBackend(normalizedLanguage);
    } catch (error) {
        console.error(`🌐 [i18n] ❌ Critical: Failed to load translations for ${normalizedLanguage}, falling back to 'en'`);
        // Если не удалось загрузить нужный язык, пытаемся загрузить английский
        try {
            translations = await loadTranslationsFromBackend('en');
            console.log(`🌐 [i18n] ✅ Fallback: Using English translations`);
        } catch (fallbackError) {
            console.error(`🌐 [i18n] ❌ Critical: Failed to load even English translations`);
            throw new Error('Failed to load translations from backend');
        }
    }

    // Инициализируем i18n только с переводами с бекенда
    i18n
        .use(initReactI18next)
        .init({
            compatibilityJSON: "v4",
            lng: normalizedLanguage,
            fallbackLng: 'en',
            resources: {
                [normalizedLanguage]: { translation: translations }
            },
            interpolation: {
                escapeValue: false
            }
        });

    console.log(`🌐 [i18n] ✅ i18n initialized successfully with language: ${normalizedLanguage.toUpperCase()} (from backend)`);
}

// Инициализируем асинхронно
initializeI18n().catch((error) => {
    console.error('🌐 [i18n] ❌ Critical error initializing i18n:', error);
    // В случае критической ошибки инициализируем с пустыми ресурсами
    i18n
        .use(initReactI18next)
        .init({
            compatibilityJSON: "v4",
            lng: 'en',
            fallbackLng: 'en',
            resources: {
                en: { translation: {} }
            },
            interpolation: {
                escapeValue: false
            }
        });
});

export default i18n;
