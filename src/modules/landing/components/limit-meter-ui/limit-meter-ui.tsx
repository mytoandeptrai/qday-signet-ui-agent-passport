import { useTranslation } from '@/integrations/i18n';
import { formatUsd } from '../../utils';

const LimitMeterUi = () => {
  const { t } = useTranslation('landing-page');

  return (
    <div className='tabular-nums'>
      <div className='flex items-baseline justify-between'>
        <span>
          <b className='text-lg font-normal'>{formatUsd(0)}</b>
          <small className='ml-1 text-body text-muted-foreground'>{t('session.spent')}</small>
        </span>
        <span>
          <b className='text-lg font-normal'>{formatUsd(20)}</b>
          <small className='ml-1 text-body text-muted-foreground'>{t('session.left')}</small>
        </span>
      </div>
      <div className='mt-2 h-1.5 overflow-hidden rounded-full bg-border'>
        <i className='block h-full w-[1.2%] rounded-full bg-brand' />
      </div>
      <div className='mt-2 flex justify-end gap-3.5 text-xs text-muted-foreground'>
        <span>{t('session.limit', { amount: 20 })}</span>
        <span>{t('how.per-call', { amount: 5 })}</span>
      </div>
    </div>
  );
};

export default LimitMeterUi;
