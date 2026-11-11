import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';

type SpendBarProps = { spent: number; limit: number; perCall?: number };

export const SpendBar = ({ spent, limit, perCall }: SpendBarProps) => {
  const { t } = useTranslation();
  const pct = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
  return (
    <div className='tabular-nums'>
      <div className='flex items-baseline justify-between'>
        <span>
          <b className='text-lead font-normal'>{money(spent)}</b>
          <small className='ml-1 text-small text-muted-foreground'>{t('spend-bar.spent')}</small>
        </span>
        <span>
          <b className='text-lead font-normal'>{money(Math.max(0, limit - spent))}</b>
          <small className='ml-1 text-small text-muted-foreground'>{t('spend-bar.left')}</small>
        </span>
      </div>
      <div className='mt-2 h-1.5 overflow-hidden rounded-full bg-border' role='progressbar' aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <i className='block h-full rounded-full bg-brand transition-[width] duration-500' style={{ width: `${pct}%` }} />
      </div>
      <div className='mt-2 flex justify-end gap-3.5 text-caption text-muted-foreground'>
        <span>{t('spend-bar.limit', { amount: limit })}</span>
        {perCall !== undefined && <span>{t('spend-bar.per-call', { amount: perCall })}</span>}
      </div>
    </div>
  );
};
