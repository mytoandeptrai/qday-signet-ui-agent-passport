import { ArrowDownToLineIcon, SendIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';

interface WalletBalanceUiProps {
  balance: number;
  onSend: () => void;
  onReceive: () => void;
}

const WalletBalanceUi = ({ balance, onSend, onReceive }: WalletBalanceUiProps) => {
  const { t } = useTranslation('wallet-page');
  return (
    <section className='flex flex-wrap items-end justify-between gap-4 rounded-lg border bg-card p-6'>
      <div>
        <p className='text-body text-muted-foreground'>{t('balance.label')}</p>
        <p className='mt-1.5 font-display text-figure leading-none font-semibold tabular-nums'>
          {money(balance)} <span className='text-body font-normal text-muted-foreground'>USD8</span>
        </p>
      </div>
      <div className='flex gap-2'>
        <Button onClick={onSend}>
          <SendIcon /> {t('balance.send')}
        </Button>
        <Button variant='outline' onClick={onReceive}>
          <ArrowDownToLineIcon /> {t('balance.receive')}
        </Button>
      </div>
    </section>
  );
};

export default WalletBalanceUi;
