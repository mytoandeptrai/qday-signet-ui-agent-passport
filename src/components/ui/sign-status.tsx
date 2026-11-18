import { LoaderCircleIcon } from 'lucide-react';
import { useTranslation } from '@/integrations/i18n';
import type { SignStatus } from '@/integrations/wallet';

interface SignStatusProps {
  status: SignStatus;
  summary?: string;
}

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
