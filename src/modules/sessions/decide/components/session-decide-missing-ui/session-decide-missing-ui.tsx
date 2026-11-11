import { useTranslation } from '@/integrations/i18n';
import { Link } from '@tanstack/react-router';

const SessionDecideMissingUi = () => {
  const { t } = useTranslation('session-decide-page');
  return (
    <p className='text-center text-muted-foreground'>
      {t('missing')}{' '}
      <Link to='/overview' className='underline'>
        {t('back')}
      </Link>
    </p>
  );
};

export default SessionDecideMissingUi;
