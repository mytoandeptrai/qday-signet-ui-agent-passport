import SignStatusUi from '@/components/app/sign-status';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import type { SignStatus } from '@/integrations/wallet';
import type { Agent } from '@/types/passport';

interface ApproveAgentUiProps {
  agent?: Agent;
  status: SignStatus;
  isLoading: boolean;
  onApprove: () => void;
  onCancel: () => void;
}

const ApproveAgentUi = ({ agent, status, isLoading, onApprove, onCancel }: ApproveAgentUiProps) => {
  const { t } = useTranslation('agents-page');
  if (!agent) return <p className='text-muted-foreground'>{t('approve.missing')}</p>;
  return (
    <div className='flex flex-col gap-4'>
      <p className='text-body'>{t('approve.summary', { agent: agent.name })}</p>
      <SignStatusUi status={status} />
      <div className='flex gap-2'>
        <Button className='flex-1' disabled={isLoading} onClick={onApprove}>
          {isLoading ? t('approve.approving') : t('approve.submit')}
        </Button>
        <Button variant='outline' className='flex-1' disabled={isLoading} onClick={onCancel}>
          {t('approve.cancel')}
        </Button>
      </div>
    </div>
  );
};

export default ApproveAgentUi;
