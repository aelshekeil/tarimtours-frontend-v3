import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translation files
import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      ar: {
        translation: arTranslation
      }
    },
    lng: localStorage.getItem('i18nextLng') || 'en', // load language from localStorage, fallback to 'en'
    fallbackLng: 'en', // fallback language if user's language is not available
    debug: true, // set to false in production
    interpolation: {
      escapeValue: false, // react already escapes by default
    },
  });

// Add a dir function to i18n
i18n.dir = (lng) => {
  console.log('Current language in i18n.dir:', lng);
  if (lng && lng.indexOf('ar') === 0) {
    return 'rtl';
  }
  return 'ltr';
};

export default i18n;
