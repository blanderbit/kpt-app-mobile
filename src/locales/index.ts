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
    const { languageService } = await import('@shared/services/api');
    return languageService.getTranslationsByCode(languageCode);
}

/**
 * Инициализирует i18n с переводами с бекенда
 */
export async function initializeI18n() {
    const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
    const normalizedLanguage = normalizeLanguageCode(deviceLanguage);

    let translations: Record<string, any>;
    try {
        translations = await loadTranslationsFromBackend(normalizedLanguage);
    } catch {
        try {
            translations = await loadTranslationsFromBackend('en');
        } catch {
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
}

export default i18n;
