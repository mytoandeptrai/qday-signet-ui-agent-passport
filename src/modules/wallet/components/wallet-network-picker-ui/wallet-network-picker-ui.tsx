import { CheckIcon, LoaderCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NETWORKS, type NetworkKey } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';

interface WalletNetworkPickerUiProps {
  active: NetworkKey;
  isConnected: boolean;
  isUnsupported: boolean;
  switchingTo?: number;
  onSwitch: (key: NetworkKey) => void;
}

const WalletNetworkPickerUi = ({ active, isConnected, isUnsupported, switchingTo, onSwitch }: WalletNetworkPickerUiProps) => {
  const { t } = useTranslation('wallet-page');
  return (
    <section>
      <h2 className='text-body font-medium'>{t('networks.title')}</h2>
      <div role='radiogroup' aria-label={t('networks.title')} className='mt-3 grid gap-2 sm:grid-cols-2'>
        {Object.values(NETWORKS)
          .filter((n) => n.enabled)
          .map((n) => {
            const isActive = isConnected && !isUnsupported && active === n.key;
            return (
              <Button
                key={n.key}
                type='button'
                role='radio'
                aria-checked={isActive}
                variant='outline'
                disabled={!isConnected || switchingTo !== undefined}
                onClick={() => !isActive && onSwitch(n.key)}
                className={cn('h-auto justify-between rounded-md px-4 py-3 text-left font-normal', isActive && 'border-primary bg-primary/5')}
              >
                <span className='text-body'>
                  {n.name} <span className='font-mono text-muted-foreground'>{n.token.symbol}</span>
                  <span className='block text-small text-muted-foreground'>{n.testnetName}</span>
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
              </Button>
            );
          })}
      </div>
      <div role='radiogroup' aria-label={t('networks.environment')} className='mt-3 flex items-center gap-2'>
        <Button type='button' role='radio' aria-checked size='sm' className='pointer-events-none'>
          {t('networks.testnet')}
        </Button>
        <Button type='button' role='radio' aria-checked={false} size='sm' variant='outline' disabled>
          {t('networks.mainnet')} · {t('networks.coming-soon')}
        </Button>
      </div>
      {!isConnected && <p className='mt-2 text-small text-muted-foreground'>{t('networks.connect-hint')}</p>}
    </section>
  );
};

export default WalletNetworkPickerUi;
