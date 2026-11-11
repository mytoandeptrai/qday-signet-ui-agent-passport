import type { Ref } from 'react';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import type { LandingLedgerRow } from '@/types/passport';
import { CARD_SHADOW, formatUsd } from '../../utils';

type SessionCardUiProps = {
  cardRef: Ref<HTMLDivElement>;
  rows: LandingLedgerRow[];
  limit: number;
  perCall: number;
  shown: number;
  spent: number;
  isRevoked: boolean;
  onRevoke: () => void;
};

const SessionCardUi = ({ cardRef, rows, limit, perCall, shown, spent, isRevoked, onRevoke }: SessionCardUiProps) => {
  const { t } = useTranslation('landing-page');

  return (
    <div
      ref={cardRef}
      className={cn(
        'absolute top-1/2 left-1/2 w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 rounded-md border bg-card text-sm md:w-[440px]',
        CARD_SHADOW
      )}
    >
      <div className='flex items-baseline justify-between gap-4 px-6 pt-[22px]'>
        <span className='text-base leading-[1.3] font-medium'>{t('session.title')}</span>
        <button
          type='button'
          disabled={isRevoked}
          onClick={onRevoke}
          className='text-[13px] font-medium text-muted-foreground hover:text-foreground disabled:text-danger'
        >
          {isRevoked ? t('session.revoked') : t('session.revoke')}
        </button>
      </div>
      <div className='px-6 pt-[18px] tabular-nums'>
        <div className='flex items-baseline justify-between'>
          <span>
            <b className='text-xl font-normal'>{formatUsd(spent)}</b>
            <small className='ml-1 text-[13px] text-muted-foreground'>{t('session.spent')}</small>
          </span>
          <span>
            <b className='text-xl font-normal'>{formatUsd(limit - spent)}</b>
            <small className='ml-1 text-[13px] text-muted-foreground'>{t('session.left')}</small>
          </span>
        </div>
        <div className='mt-2 h-1.5 overflow-hidden rounded-full bg-border'>
          <i className='block h-full rounded-full bg-brand transition-[width] duration-[600ms]' style={{ width: `${(spent / limit) * 100}%` }} />
        </div>
        <div className='mt-2 flex justify-end gap-3.5 text-xs text-muted-foreground'>
          <span>{t('session.limit', { amount: limit })}</span>
          <span>{t('session.per-call', { amount: perCall })}</span>
        </div>
      </div>
      <div className='px-6 pt-5 pb-1 text-sm font-medium text-muted-foreground'>{t('session.activity')}</div>
      <ul className='m-0 min-h-[162px] list-none px-6 pb-[18px]'>
        {rows.map((r, i) => (
          <li
            key={r.service}
            className={cn(
              'grid h-9 grid-cols-[minmax(0,1fr)_auto_56px] items-center gap-x-4 tabular-nums transition-all duration-300',
              i < shown ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
            )}
          >
            <span className={cn('truncate', r.stopped && 'text-muted-foreground')}>{r.service}</span>
            <span className={cn('text-right text-[13px]', r.stopped && 'text-text-3 line-through')}>{formatUsd(r.amount)}</span>
            <span className={cn('text-right text-[13px] text-muted-foreground', r.stopped && 'text-danger')}>{r.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionCardUi;
