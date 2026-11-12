import { CheckIcon, LoaderCircleIcon } from 'lucide-react';
import { NETWORKS } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { useActiveNetwork, useWallet } from '@/integrations/wallet';
import { cn } from '@/lib/utils';

const WalletNetworksUi = () => {
  const { t } = useTranslation('wallet-page');
  const { isConnected } = useWallet();
  const { network, isUnsupported, switchingTo, switchNetwork } = useActiveNetwork();

  return (
    <section className='mt-8'>
      <h2 className='text-body font-medium'>{t('networks.title')}</h2>
      <div role='radiogroup' aria-label={t('networks.title')} className='mt-3 grid gap-2 sm:grid-cols-2'>
        {Object.values(NETWORKS)
          .filter((n) => n.enabled)
          .map((n) => {
            const isActive = isConnected && !isUnsupported && network.key === n.key;
            return (
              <button
                key={n.key}
                type='button'
                role='radio'
                aria-checked={isActive}
                disabled={!isConnected || switchingTo !== undefined}
                onClick={() => !isActive && switchNetwork(n.key)}
                className={cn(
                  'flex items-center justify-between rounded-md border px-4 py-3 text-left transition-colors disabled:cursor-default',
                  isActive ? 'border-primary bg-primary/5' : isConnected && 'hover:border-primary/40',
                )}
              >
                <span className='text-body'>
                  {n.name} <span className='font-mono text-muted-foreground'>{n.token.symbol}</span>
                  {n.testnet && <span className='block text-small text-muted-foreground'>{t('networks.testnet')}</span>}
                </span>
                <span className='flex items-center gap-1.5 text-small text-muted-foreground'>
                  {switchingTo === n.chainId ? (
                    <LoaderCircleIcon className='size-4 animate-spin motion-reduce:animate-none' />
                  ) : isActive ? (
                    <>
                      <CheckIcon className='size-4 text-primary' />
                      {t('networks.connected')}
                    </>
                  ) : (
                    isConnected && t('networks.switch')
                  )}
                </span>
              </button>
            );
          })}
      </div>
      {!isConnected && <p className='mt-2 text-small text-muted-foreground'>{t('networks.connect-hint')}</p>}
    </section>
  );
};

export default WalletNetworksUi;
