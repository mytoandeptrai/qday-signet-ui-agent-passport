import { ArrowDownToLineIcon, EyeIcon, EyeOffIcon, SendIcon, WalletIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CopyButton from '@/components/ui/copy-button';
import { useTranslation } from '@/integrations/i18n';

interface WalletBalanceUiProps {
  chainName: string;
  networkName: string;
  address?: string;
  symbol: string;
  amount: string;
  hidden: boolean;
  canSend: boolean;
  onToggleHidden: () => void;
  onSend: () => void;
  onReceive: () => void;
}

const WalletBalanceUi = ({ chainName, networkName, address, symbol, amount, hidden, canSend, onToggleHidden, onSend, onReceive }: WalletBalanceUiProps) => {
  const { t } = useTranslation('wallet-page');
  return (
    <section className='mt-8 rounded-lg border bg-card p-6'>
      <div className='flex items-center justify-between gap-2'>
        <p className='flex items-center gap-2 text-body font-medium'>
          <WalletIcon className='size-4 text-primary' />
          {t('balance.title', { chain: chainName })}
        </p>
        <Badge variant='outline'>{t('balance.metamask')}</Badge>
      </div>
      <div className='mt-5 flex items-center justify-between gap-4'>
        <p className='text-body text-muted-foreground'>{t('balance.label', { symbol })}</p>
        <Button
          variant='ghost'
          size='icon-sm'
          aria-pressed={hidden}
          aria-label={t(hidden ? 'balance.show' : 'balance.hide')}
          onClick={onToggleHidden}
          className='text-muted-foreground'
        >
          {hidden ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
      <p className='mt-1 font-display text-figure leading-none font-semibold tabular-nums' aria-live='polite'>
        {hidden ? '••••' : amount} <span className='text-body font-normal text-muted-foreground'>{symbol}</span>
      </p>
      <div className='mt-5 flex items-center gap-2 rounded-md border bg-background/70 py-1.5 pr-1.5 pl-3'>
        <code className='min-w-0 flex-1 truncate font-mono text-small'>{address}</code>
        {address && <CopyButton value={address} className='size-8 shrink-0' aria-label={t('balance.copy-address')} toastMessage={t('balance.copied')} />}
      </div>
      <div className='mt-5 flex flex-wrap items-center justify-between gap-3'>
        <div className='flex gap-2'>
          <Button onClick={onSend} disabled={!canSend}>
            <SendIcon /> {t('balance.send')}
          </Button>
          <Button variant='outline' onClick={onReceive}>
            <ArrowDownToLineIcon /> {t('balance.receive')}
          </Button>
        </div>
        <p className='text-small text-muted-foreground'>
          {chainName} · {networkName}
        </p>
      </div>
    </section>
  );
};

export default WalletBalanceUi;
