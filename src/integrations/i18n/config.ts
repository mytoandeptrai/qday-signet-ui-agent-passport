import { env } from '@/constant';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGE_CODES } from './languages';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGE_CODES,
    debug: env.ENVIRONMENT === 'development',

    /** Interpolation settings */
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    /** Backend settings for loading translation files */
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    /** Default namespace */
    defaultNS: 'common',
    ns: [
      'common',
      'validation',
      'navigation',
      'register-page',
      'login-page',
      'verify-email-page',
      'verified-email-page',
      'dashboard-page',
      'balance-page',
      'wallet-address-page',
      'transactions-page',
      'merchant-detail-page',
      'transaction-detail-page',
      'settings-page',
      'business-settings-page',
      'smart-accounts-page',
      'smart-account-detail-page',
      'api-keys-page',
      'sdk-docs-page',
    ],

    /** Detection settings */
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

// Browsers pick CJK glyphs from the document language, so keep <html lang> in sync.
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;
