import { useTranslation } from '@/integrations/i18n';

const SessionDecideMissingUi = () => {
  const { t } = useTranslation('session-decide-page');
  return <p className='text-muted-foreground'>{t('missing')}</p>;
};

export default SessionDecideMissingUi;
