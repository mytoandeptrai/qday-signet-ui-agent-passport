import { LoaderCircleIcon } from 'lucide-react';
import { useTranslation } from '@/integrations/i18n';
import type { SignStatus } from '@/integrations/wallet';

interface SignStatusProps {
  status: SignStatus;
}

/** Feedback for a MetaMask signature: waiting, rejected or failed. Success is shown by each flow's own result. */
const SignStatusUi = ({ status }: SignStatusProps) => {
  const { t } = useTranslation('wallet');
  if (status === 'waiting')
    return (
      <p role='status' className='flex items-center gap-2 text-small text-muted-foreground'>
        <LoaderCircleIcon className='size-4 animate-spin' />
        {t('sign.waiting')}
      </p>
    );
  if (status === 'rejected' || status === 'error')
    return (
      <p role='alert' className='text-small text-destructive'>
        {t(`sign.${status}`)}
      </p>
    );
  return null;
};

export default SignStatusUi;
