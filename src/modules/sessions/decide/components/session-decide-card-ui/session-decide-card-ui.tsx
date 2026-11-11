import SignStatusUi from '@/components/app/sign-status';
import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import type { SignStatus } from '@/integrations/wallet';
import { money, timeAgo } from '@/lib/format';
import type { Escalation } from '@/types/passport';

type SessionDecideCardUiProps = {
  escalation: Escalation;
  isDone: boolean;
  status: SignStatus;
  isLoading: boolean;
  onApprove: () => void;
  onDecline: () => void;
};

const SessionDecideCardUi = ({ escalation: e, isDone, status, isLoading, onApprove, onDecline }: SessionDecideCardUiProps) => {
  const { t } = useTranslation('session-decide-page');
  return (
    <div>
      <div className='flex items-center justify-between'>
        <span className='text-small text-muted-foreground'>{t('over-limit', { when: timeAgo(e.requestedAt) })}</span>
        <StatusBadge status={e.status} />
      </div>
      <p className='mt-3 text-lead font-medium'>{t('wants', { agent: e.agent, amount: money(e.amount) })}</p>
      <p className='mt-2 text-body text-muted-foreground'>{t('explain', { service: e.service, description: e.description })}</p>
      <div className='mt-3'>
        <SignStatusUi status={status} />
      </div>
      <div className='mt-6 flex gap-2'>
        <Button className='flex-1' disabled={isDone || isLoading} onClick={onApprove}>
          {t('labels.approve-once')}
        </Button>
        <Button variant='outline' className='flex-1' disabled={isDone || isLoading} onClick={onDecline}>
          {t('labels.decline')}
        </Button>
      </div>
    </div>
  );
};

export default SessionDecideCardUi;
