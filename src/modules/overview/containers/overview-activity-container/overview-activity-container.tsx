import { Link } from '@tanstack/react-router';
import { useTranslation } from '@/integrations/i18n';
import { OverviewActivityUi } from '../../components';
import { useOverviewActivityContainer } from '../../hooks';

const OverviewActivityContainer = () => {
  const { t } = useTranslation('overview-page');
  const { items } = useOverviewActivityContainer();
  return (
    <section className='mt-12 max-w-250'>
      <div className='mb-4 flex items-baseline justify-between'>
        <h2 className='text-body font-medium'>{t('activity.title')}</h2>
        <Link to='/activity' className='text-small text-muted-foreground hover:text-foreground'>
          {t('activity.see-all')}
        </Link>
      </div>
      <OverviewActivityUi items={items} />
    </section>
  );
};

export default OverviewActivityContainer;
