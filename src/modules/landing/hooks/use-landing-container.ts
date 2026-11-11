import { ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';

export const useLandingContainer = () => {
  const { t } = useTranslation('landing-page');

  return {
    agentsLine: { id: 'agents', text: t('lines.agents.text'), link: { label: t('lines.agents.link'), href: '#' } },
    recordLine: {
      id: 'record',
      align: 'right' as const,
      text: t('lines.record.text'),
      link: { label: t('lines.record.link'), to: ROUTES.ACTIVITY },
    },
    servicesLine: {
      id: 'services',
      text: t('lines.services.text'),
      link: { label: t('lines.services.link'), to: ROUTES.EXPLORE },
    },
  };
};
