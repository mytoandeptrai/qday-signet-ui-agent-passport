import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { money, timeAgo } from '@/lib/format';
import type { Escalation } from '@/types/passport';

type SessionDecideCardUiProps = {
  escalation: Escalation;
  isDone: boolean;
  onApprove: () => void;
  onDecline: () => void;
};

const SessionDecideCardUi = ({ escalation: e, isDone, onApprove, onDecline }: SessionDecideCardUiProps) => {
  const { t } = useTranslation('session-decide-page');
  return (
    <div className='mx-auto max-w-[440px] rounded-md border p-6 shadow-card'>
      <div className='flex items-center justify-between'>
        <span className='text-small text-muted-foreground'>{t('over-limit', { when: timeAgo(e.requestedAt) })}</span>
        <StatusBadge status={e.status} />
      </div>
      <h1 className='mt-3 text-lead font-medium'>{t('wants', { agent: e.agent, amount: money(e.amount) })}</h1>
      <p className='mt-2 text-body text-muted-foreground'>{t('explain', { service: e.service, description: e.description })}</p>
      <div className='mt-6 flex gap-2'>
        <Button className='flex-1' disabled={isDone} onClick={onApprove}>
          {t('labels.approve-once')}
        </Button>
        <Button variant='outline' className='flex-1' disabled={isDone} onClick={onDecline}>
          {t('labels.decline')}
        </Button>
      </div>
    </div>
  );
};

export default SessionDecideCardUi;
