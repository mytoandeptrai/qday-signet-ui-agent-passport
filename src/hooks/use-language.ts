import { i18n, LANGUAGES } from '@/integrations/i18n';
import { useTranslation } from 'react-i18next';

/** Current UI language and a setter; i18next persists the choice in localStorage. */
export const useLanguage = () => {
  const { i18n: instance } = useTranslation();
  const code = instance.resolvedLanguage ?? i18n.language;
  const current = LANGUAGES.find((language) => language.code === code) ?? LANGUAGES[0];

  return {
    languages: LANGUAGES,
    current,
    onChangeLanguage: (next: string) => instance.changeLanguage(next),
  };
};
