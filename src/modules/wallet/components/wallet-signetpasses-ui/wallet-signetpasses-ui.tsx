import { Link } from '@tanstack/react-router';
import { ChevronRightIcon, PlusIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ShortAddress from '@/components/ui/short-address';
import type { NetworkConfig } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';
import type { SignetPass } from '@/types/passport';

interface WalletSignetpassesUiProps {
  passes: SignetPass[];
  network: NetworkConfig;
  onCreate: () => void;
}

const WalletSignetpassesUi = ({ passes, network, onCreate }: WalletSignetpassesUiProps) => {
  const { t } = useTranslation('wallet-page');
  return (
    <section className='mt-8'>
      <div className='flex items-center justify-between gap-2'>
        <h2 className='text-body font-medium'>{t('signetpasses.title')}</h2>
        <Button variant='outline' size='sm' onClick={onCreate}>
          <PlusIcon /> {t('signetpasses.create')}
        </Button>
      </div>
      {passes.length === 0 ? (
        <p className='mt-3 text-body text-muted-foreground'>{t('signetpasses.empty', { network: network.name })}</p>
      ) : (
        <ul className='mt-3 divide-y overflow-hidden rounded-md border'>
          {passes.map((pass) => (
            <li key={pass.id}>
              <Button variant='ghost' asChild className='h-auto w-full justify-start gap-3 rounded-none px-4 py-3 text-left font-normal'>
                <Link to='/signetpass/$passId' params={{ passId: pass.id }}>
                  <span className='min-w-0 flex-1'>
                    <span className='block truncate text-body font-medium'>{pass.name}</span>
                    <span className='block font-mono text-small text-muted-foreground'>
                      <ShortAddress value={pass.address} />
                    </span>
                  </span>
                  <Badge variant='outline'>{t(pass.status === 'active' ? 'signetpasses.active' : 'signetpasses.inactive')}</Badge>
                  <span className='text-body tabular-nums'>
                    {money(pass.balance.available)} {network.token.symbol}
                  </span>
                  <ChevronRightIcon className='text-muted-foreground' />
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default WalletSignetpassesUi;
