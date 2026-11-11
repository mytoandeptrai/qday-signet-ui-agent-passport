import { useTranslation } from '@/integrations/i18n';

export const useTermsContainer = () => {
  const { t } = useTranslation('legal-page');
  return { title: t('terms.title'), updated: t('updated'), paragraphs: t('paragraphs', { returnObjects: true }) as string[] };
};

export const usePrivacyContainer = () => {
  const { t } = useTranslation('legal-page');
  return { title: t('privacy.title'), updated: t('updated'), paragraphs: t('paragraphs', { returnObjects: true }) as string[] };
};
