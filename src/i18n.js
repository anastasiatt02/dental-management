import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations manually
import en from './locales/en.json';
import alb from './locales/alb.json';

i18n
  .use(initReactI18next) // Connects i18next to React
  .init({
    resources: {
      en: { translation: en },
      alb: { translation: alb }
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // If language is missing, fallback to English
    interpolation: { escapeValue: false } // React alread
})

export default i18n;