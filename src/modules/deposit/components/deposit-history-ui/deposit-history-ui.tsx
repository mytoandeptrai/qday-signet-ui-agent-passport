import { StatusBadge } from '@/components/app/status-badge';
import { useTranslation } from '@/integrations/i18n';
import { money, timeAgo } from '@/lib/format';
import type { Deposit } from '@/types/passport';

type DepositHistoryUiProps = {
  deposits: Deposit[];
};

const DepositHistoryUi = ({ deposits }: DepositHistoryUiProps) => {
  const { t } = useTranslation('deposit-page');
  return (
    <>
      <h2 className='mt-12 mb-3 text-body font-medium'>{t('history.title')}</h2>
      <ul className='divide-y rounded-md border'>
        {deposits.map((d) => (
          <li key={d.id} className='flex items-center justify-between gap-4 px-5 py-3 text-body'>
            <div>
              <div className='capitalize'>{d.method}</div>
              <div className='text-caption text-text-3'>{timeAgo(d.createdAt)}</div>
            </div>
            <div className='flex items-center gap-3'>
              <StatusBadge status={d.status} />
              <span className='tabular-nums'>{money(d.amount)}</span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default DepositHistoryUi;
