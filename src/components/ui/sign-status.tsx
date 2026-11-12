import { LoaderCircleIcon } from 'lucide-react';
import { useTranslation } from '@/integrations/i18n';
import type { SignStatus } from '@/integrations/wallet';

interface SignStatusProps {
  status: SignStatus;
  /** What is being signed, shown while waiting so the MetaMask prompt is recognisable. */
  summary?: string;
}

/** Feedback for a MetaMask signature: what it is before, while waiting, and after a rejection or failure. Success is shown by each flow's own result. */
const SignStatusUi = ({ status, summary }: SignStatusProps) => {
  const { t } = useTranslation('wallet');
  if (status === 'waiting')
    return (
      <p role='status' className='flex items-center gap-2 text-small text-muted-foreground'>
        <LoaderCircleIcon className='size-4 animate-spin motion-reduce:animate-none' />
        {summary ? t('sign.waiting-for', { summary }) : t('sign.waiting')}
      </p>
    );
  if (status === 'rejected' || status === 'error')
    return (
      <p role='alert' className='text-small text-destructive'>
        {t(`sign.${status}`)}
      </p>
    );
  if (status === 'idle') return <p className='text-caption text-muted-foreground'>{t('sign.idle')}</p>;
  return null;
};

export default SignStatusUi;
