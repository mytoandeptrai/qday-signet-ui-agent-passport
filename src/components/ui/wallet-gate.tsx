import { LoaderCircleIcon, WalletIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { NETWORKS } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { useActiveNetwork, useWallet } from '@/integrations/wallet';

interface WalletGateProps {
  children: ReactNode;
}

const gateClass = 'flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center';

/** Renders money/signing UI only once a wallet is connected on a supported network; otherwise shows what to do next. */
const WalletGate = ({ children }: WalletGateProps) => {
  const { t } = useTranslation('wallet');
  const { isConnected, status, connect } = useWallet();
  const { isUnsupported, switchingTo, switchNetwork } = useActiveNetwork();

  if (isConnected && !isUnsupported) return <>{children}</>;

  if (isConnected) {
    return (
      <div className={gateClass}>
        <WalletIcon className='size-6 text-muted-foreground' strokeWidth={1.4} />
        <div>
          <p className='font-medium text-foreground'>{t('gate.unsupported-title')}</p>
          <p className='mt-1 max-w-sm text-small text-muted-foreground'>{t('gate.unsupported-description')}</p>
        </div>
        <div className='flex flex-wrap justify-center gap-2'>
          {Object.values(NETWORKS)
            .filter((n) => n.enabled)
            .map((n) => (
              <Button key={n.key} variant='outline' disabled={switchingTo !== undefined} onClick={() => switchNetwork(n.key)}>
                {switchingTo === n.chainId && <LoaderCircleIcon className='animate-spin' />}
                {t('gate.switch', { network: n.name })}
              </Button>
            ))}
        </div>
      </div>
    );
  }

  const isBusy = status !== 'idle';
  return (
    <div className={gateClass}>
      <WalletIcon className='size-6 text-muted-foreground' strokeWidth={1.4} />
      <div>
        <p className='font-medium text-foreground'>{t('gate.title')}</p>
        <p className='mt-1 max-w-sm text-small text-muted-foreground'>{t('gate.description')}</p>
      </div>
      <Button onClick={connect} disabled={isBusy}>
        {isBusy && <LoaderCircleIcon className='animate-spin' />}
        {status === 'connecting' ? t('connect.connecting') : t('connect.button')}
      </Button>
    </div>
  );
};

export default WalletGate;
