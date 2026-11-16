import { PlusIcon, ShieldCheckIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CopyButton from '@/components/ui/copy-button';
import type { NetworkConfig } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';
import type { SignetPass } from '@/types/passport';

interface SignetpassBalanceUiProps {
  pass: SignetPass;
  network: NetworkConfig;
  onAddFunds: () => void;
  onActivate: () => void;
}

const SignetpassBalanceUi = ({ pass, network, onAddFunds, onActivate }: SignetpassBalanceUiProps) => {
  const { t } = useTranslation('signetpass-page');
  return (
    <section className='rounded-lg border bg-card p-6'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <div className='flex items-center gap-2'>
            <p className='text-body text-muted-foreground'>{t('details.balance')}</p>
            <Badge variant='outline'>{t(pass.status === 'active' ? 'details.active' : 'details.inactive')}</Badge>
          </div>
          <p className='mt-1.5 font-display text-figure leading-none font-semibold tabular-nums'>
            {money(pass.balance.available)} <span className='text-body font-normal text-muted-foreground'>{network.token.symbol}</span>
          </p>
          {pass.balance.held > 0 && <p className='mt-2 text-small text-muted-foreground'>{t('details.held', { amount: money(pass.balance.held) })}</p>}
        </div>
        {pass.status === 'active' ? (
          <Button onClick={onAddFunds}>
            <PlusIcon /> {t('details.add-funds')}
          </Button>
        ) : (
          <Button onClick={onActivate}>
            <ShieldCheckIcon /> {t('details.activate')}
          </Button>
        )}
      </div>
      <div className='mt-5 flex items-center gap-2 rounded-md border bg-background/70 py-1.5 pr-1.5 pl-3'>
        <code className='min-w-0 flex-1 truncate font-mono text-small'>{pass.address}</code>
        <CopyButton value={pass.address} className='size-8 shrink-0' aria-label={t('details.copy-address')} toastMessage={t('details.address-copied')} />
      </div>
      <p className='mt-2 text-caption text-muted-foreground'>
        {pass.status === 'active' ? t('add-funds.crypto.note', { token: network.token.symbol, network: network.name }) : t('details.inactive-note')}
      </p>
    </section>
  );
};

export default SignetpassBalanceUi;
