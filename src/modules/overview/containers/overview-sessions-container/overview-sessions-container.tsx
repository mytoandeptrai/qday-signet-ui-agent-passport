import { Link } from '@tanstack/react-router';
import { useTranslation } from '@/integrations/i18n';
import { OverviewRevokeDialogUi, OverviewSessionCardUi } from '../../components';
import { useOverviewSessionsContainer } from '../../hooks';

const OverviewSessionsContainer = () => {
  const { t } = useTranslation('overview-page');
  const { sessions, target, onRevoke, onCloseRevoke, onConfirmRevoke } = useOverviewSessionsContainer();
  return (
    <section className='mt-16 max-w-250'>
      <div className='mb-4 flex items-baseline justify-between'>
        <h2 className='text-body font-medium'>{t('sessions.title')}</h2>
        <Link to='/overview' search={{ dialog: 'create-session' }} className='text-small text-muted-foreground hover:text-foreground'>
          {t('labels.new-session')}
        </Link>
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        {sessions.map((s) => (
          <OverviewSessionCardUi key={s.id} session={s} onRevoke={onRevoke} />
        ))}
      </div>
      <OverviewRevokeDialogUi session={target} onClose={onCloseRevoke} onConfirm={onConfirmRevoke} />
    </section>
  );
};

export default OverviewSessionsContainer;
