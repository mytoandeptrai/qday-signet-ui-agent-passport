import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { money, timeAgo } from '@/lib/format';
import type { Voucher } from '@/types/passport';

type VoucherListUiProps = {
  vouchers: Voucher[];
  onRedeem: (code: string) => void;
};

const VoucherListUi = ({ vouchers, onRedeem }: VoucherListUiProps) => {
  const { t } = useTranslation('vouchers-page');
  return (
    <ul className='mt-10 divide-y rounded-md border'>
      {vouchers.map((v) => (
        <li key={v.id} className='flex items-center justify-between gap-4 px-5 py-3 text-body'>
          <div>
            <div className='font-mono text-small'>{v.code}</div>
            <div className='text-caption text-text-3'>
              {v.redeemedAt ? t('list.redeemed', { when: timeAgo(v.redeemedAt) }) : t('list.issued', { when: timeAgo(v.createdAt) })}
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <StatusBadge status={v.status} />
            <span className='tabular-nums'>{money(v.amount)}</span>
            {v.status === 'unused' && (
              <Button size='sm' variant='outline' onClick={() => onRedeem(v.code)}>
                {t('labels.redeem')}
              </Button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default VoucherListUi;
