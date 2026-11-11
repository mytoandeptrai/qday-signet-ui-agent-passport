import { SpendBar } from '@/components/app/spend-bar';
import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { timeAgo } from '@/lib/format';
import type { SpendingSession } from '@/types/passport';
import { Link } from '@tanstack/react-router';

interface SessionsListUiProps {
  sessions: SpendingSession[];
  onRevoke: (id: string) => void;
}

const SessionsListUi = ({ sessions, onRevoke }: SessionsListUiProps) => {
  const { t } = useTranslation('sessions-page');
  if (sessions.length === 0) return <p className='text-body text-muted-foreground'>{t('empty')}</p>;
  return (
    <ul className='divide-y rounded-md border'>
      {sessions.map((s) => (
        <li key={s.id} className='grid gap-3 px-4 py-4 md:grid-cols-[minmax(0,1fr)_240px_auto] md:items-center'>
          <div className='min-w-0'>
            <Link to='/sessions/$sessionId' params={{ sessionId: s.id }} className='text-body font-medium hover:underline'>
              {s.task}
            </Link>
            <p className='text-small text-muted-foreground'>
              {s.agent} · {timeAgo(s.createdAt)}
            </p>
          </div>
          <SpendBar spent={s.spent} limit={s.limit} />
          <div className='flex items-center gap-2'>
            <StatusBadge status={s.status} />
            {s.status === 'active' && (
              <Button size='sm' variant='outline' onClick={() => onRevoke(s.id)}>
                {t('labels.revoke')}
              </Button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SessionsListUi;
