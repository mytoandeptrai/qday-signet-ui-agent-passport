import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { money, timeAgo } from '@/lib/format';
import type { Escalation } from '@/types/passport';
import { Link } from '@tanstack/react-router';

type OverviewPendingBannerUiProps = {
  escalation: Escalation;
};

const OverviewPendingBannerUi = ({ escalation: e }: OverviewPendingBannerUiProps) => {
  const { t } = useTranslation('overview-page');
  return (
    <div className='mb-8 flex flex-wrap items-center justify-between gap-3 border border-brand/40 bg-brand/5 px-5 py-4'>
      <div className='text-body'>
        <b className='font-medium'>{e.agent}</b> {t('pending.wants-to-spend')} <b className='font-medium'>{money(e.amount)}</b>{' '}
        {t('pending.on')} {e.service}: {e.description}.
        <span className='ml-2 text-muted-foreground'>{timeAgo(e.requestedAt)}</span>
      </div>
      <Button asChild size='sm' variant='outline'>
        <Link to='/agent-escalation/decide' search={{ id: e.id }}>
          {t('pending.review')}
        </Link>
      </Button>
    </div>
  );
};

export default OverviewPendingBannerUi;
