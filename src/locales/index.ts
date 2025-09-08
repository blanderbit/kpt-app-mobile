import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import uk from './uk.json';
import ru from './ru.json';

const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: "v4",
        lng: deviceLanguage,
        fallbackLng: 'en',
        resources: {
            en: { translation: en },
            uk: { translation: uk },
            ru: { translation: ru }
        },
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
