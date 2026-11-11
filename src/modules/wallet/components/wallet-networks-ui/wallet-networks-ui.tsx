import { NETWORKS } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';

const WalletNetworksUi = () => {
  const { t } = useTranslation('wallet-page');
  return (
    <section className='mt-8'>
      <h2 className='text-body font-medium'>{t('networks.title')}</h2>
      <ul className='mt-3 grid gap-2 sm:grid-cols-2'>
        {Object.values(NETWORKS).map((network) => (
          <li
            key={network.key}
            aria-disabled={!network.enabled}
            className={cn('flex items-center justify-between rounded-md border px-4 py-3', !network.enabled && 'opacity-50')}
          >
            <span className='text-body'>
              {network.name} <span className='text-muted-foreground'>· {network.token.symbol}</span>
            </span>
            <span className='text-small text-muted-foreground'>
              {network.enabled ? t('networks.active') : t('networks.coming-soon')}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default WalletNetworksUi;
