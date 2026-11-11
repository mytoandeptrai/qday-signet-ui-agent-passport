import { LoaderCircleIcon, WalletIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { useWallet } from '@/integrations/wallet';

interface WalletGateProps {
  children: ReactNode;
}

/** Renders money/signing UI only once a wallet is connected; otherwise shows a connect prompt. */
const WalletGate = ({ children }: WalletGateProps) => {
  const { t } = useTranslation('wallet');
  const { isConnected, status, connect } = useWallet();

  if (isConnected) return <>{children}</>;

  const connecting = status === 'connecting';
  return (
    <div className='flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center'>
      <WalletIcon className='size-6 text-muted-foreground' strokeWidth={1.4} />
      <div>
        <p className='font-medium text-foreground'>{t('gate.title')}</p>
        <p className='mt-1 max-w-sm text-small text-muted-foreground'>{t('gate.description')}</p>
      </div>
      <Button onClick={connect} disabled={connecting}>
        {connecting && <LoaderCircleIcon className='animate-spin' />}
        {connecting ? t('connect.connecting') : t('connect.button')}
      </Button>
      {(status === 'rejected' || status === 'error') && (
        <p role='alert' className='text-small text-destructive'>
          {t(`connect.${status}`)}
        </p>
      )}
    </div>
  );
};

export default WalletGate;
