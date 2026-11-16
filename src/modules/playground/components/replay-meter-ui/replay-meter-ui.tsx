import { useTranslation } from '@/integrations/i18n';

type ReplayMeterUiProps = {
  spent: number;
  limit: number;
};

const ReplayMeterUi = ({ spent, limit }: ReplayMeterUiProps) => {
  const { t } = useTranslation('playground-page');
  return (
    <div>
      <p className='text-body text-muted-foreground'>{t('meter.title')}</p>
      <p className='mt-1 font-display text-figure leading-none font-semibold tabular-nums'>
        {spent.toFixed(2)}
        <span className='text-lead text-muted-foreground'> / {limit.toFixed(2)} USDC</span>
      </p>
      <div className='mt-3 h-1 overflow-hidden rounded-full bg-border'>
        <div className='h-full bg-brand transition-[width] duration-500 motion-reduce:transition-none' style={{ width: `${Math.min(100, (spent / limit) * 100)}%` }} />
      </div>
    </div>
  );
};

export default ReplayMeterUi;
