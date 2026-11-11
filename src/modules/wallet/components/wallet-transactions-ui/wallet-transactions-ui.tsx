import { ArrowDownLeftIcon, ArrowUpRightIcon } from 'lucide-react';
import { useTranslation } from '@/integrations/i18n';
import { money, shortAddress, timeAgo } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { WalletTx } from '@/types/passport';

interface WalletTransactionsUiProps {
  transactions: WalletTx[];
}

const WalletTransactionsUi = ({ transactions }: WalletTransactionsUiProps) => {
  const { t } = useTranslation('wallet-page');
  return (
    <section className='mt-8'>
      <h2 className='text-body font-medium'>{t('transactions.title')}</h2>
      {transactions.length === 0 ? (
        <p className='mt-3 text-body text-muted-foreground'>{t('transactions.empty')}</p>
      ) : (
        <ul className='mt-3 divide-y rounded-md border'>
          {transactions.map((tx) => {
            const incoming = tx.kind === 'receive';
            const Icon = incoming ? ArrowDownLeftIcon : ArrowUpRightIcon;
            return (
              <li key={tx.id} className='flex items-center gap-3 px-4 py-3'>
                <Icon className='size-4 text-muted-foreground' />
                <div className='min-w-0 flex-1'>
                  <p className='text-body'>
                    {t(`transactions.kinds.${tx.kind}`)}{' '}
                    <span className='font-mono text-small'>
                      {tx.counterparty.startsWith('0x') ? shortAddress(tx.counterparty) : tx.counterparty}
                    </span>
                  </p>
                  <p className='text-small text-muted-foreground'>{timeAgo(tx.createdAt)}</p>
                </div>
                <span className={cn('text-body tabular-nums', incoming && 'text-success')}>
                  {incoming ? '+' : '−'}
                  {money(tx.amount)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default WalletTransactionsUi;
