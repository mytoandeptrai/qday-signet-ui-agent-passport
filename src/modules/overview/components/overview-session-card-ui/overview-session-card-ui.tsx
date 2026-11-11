import { SpendBar } from '@/components/app/spend-bar';
import { StatusBadge } from '@/components/app/status-badge';
import { useTranslation } from '@/integrations/i18n';
import { timeAgo } from '@/lib/format';
import type { SpendingSession } from '@/types/passport';
import { Link } from '@tanstack/react-router';

type OverviewSessionCardUiProps = {
  session: SpendingSession;
  onRevoke: (id: string) => void;
};

const OverviewSessionCardUi = ({ session: s, onRevoke }: OverviewSessionCardUiProps) => {
  const { t } = useTranslation('overview-page');
  return (
    <div className='rounded-md border p-5'>
      <div className='mb-4 flex items-start justify-between gap-3'>
        <div>
          <Link to='/sessions/$sessionId' params={{ sessionId: s.id }} className='text-base font-medium hover:underline'>
            {s.task}
          </Link>
          <div className='mt-1 text-caption text-muted-foreground'>
            {s.agent} · {timeAgo(s.createdAt)}
          </div>
        </div>
        <StatusBadge status={s.status} />
      </div>
      <SpendBar spent={s.spent} limit={s.limit} perCall={s.perCallLimit} />
      {s.status === 'active' && (
        <button type='button' onClick={() => onRevoke(s.id)} className='mt-4 text-small font-medium text-muted-foreground hover:text-danger'>
          {t('sessions.revoke')}
        </button>
      )}
    </div>
  );
};

export default OverviewSessionCardUi;
