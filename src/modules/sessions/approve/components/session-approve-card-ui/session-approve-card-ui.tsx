import { SpendBar } from '@/components/app/spend-bar';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';

type SessionApproveCardUiProps = {
  task: string;
  agent: string;
  limit: number;
  perCall: number;
  hours: number;
  available: number;
  isShort: boolean;
  onApprove: () => void;
  onDecline: () => void;
};

const SessionApproveCardUi = ({ task, agent, limit, perCall, hours, available, isShort, onApprove, onDecline }: SessionApproveCardUiProps) => {
  const { t } = useTranslation('session-approve-page');
  return (
    <div className='mx-auto max-w-[440px] rounded-md border p-6 shadow-card'>
      <div className='text-small text-muted-foreground'>{t('asking', { agent })}</div>
      <h1 className='mt-1 text-lead font-medium'>{task}</h1>
      <div className='my-5'>
        <SpendBar spent={0} limit={limit} perCall={perCall} />
      </div>
      <p className='text-body text-muted-foreground'>{t('expires', { hours })}</p>
      {isShort && (
        <p role='alert' className='mt-3 text-body text-danger'>
          {t('short', { available: money(available) })}
        </p>
      )}
      <div className='mt-6 flex gap-2'>
        <Button className='flex-1' disabled={isShort} onClick={onApprove}>
          {t('labels.approve')}
        </Button>
        <Button variant='outline' className='flex-1' onClick={onDecline}>
          {t('labels.decline')}
        </Button>
      </div>
    </div>
  );
};

export default SessionApproveCardUi;
