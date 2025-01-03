import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // Connect i18next to React
  .init({
    fallbackLng: 'en', // Default language
    lng: 'en', // Current language
    resources: {
      en: {
        translation: {
          welcome: 'Welcome',
          login: 'Login',
          logout: 'Logout',
          // Add more key-value pairs here
        },
      },
      es: {
        translation: {
          welcome: 'Bienvenido',
          login: 'Iniciar sesión',
          logout: 'Cerrar sesión',
          // Add more key-value pairs here
        },
      },
      fr: {
        translation: {
          welcome: 'Bienvenue',
          login: 'Se connecter',
          logout: 'Se déconnecter',
          // Add more key-value pairs here
        },
      },
    },
    interpolation: {
      escapeValue: false, // React already escapes strings
    },
  });

export default i18n;
