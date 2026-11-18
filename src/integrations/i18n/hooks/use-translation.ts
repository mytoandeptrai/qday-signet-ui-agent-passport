import { useTranslation as useI18nTranslation } from 'react-i18next';

export function useTranslation(namespace?: string) {
  return useI18nTranslation(namespace);
}
