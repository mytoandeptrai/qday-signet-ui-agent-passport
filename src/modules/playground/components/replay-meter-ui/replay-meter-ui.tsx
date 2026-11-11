import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';

type ReplayMeterUiProps = {
  spent: number;
  limit: number;
};

const ReplayMeterUi = ({ spent, limit }: ReplayMeterUiProps) => {
  const { t } = useTranslation('playground-page');
  return (
    <div>
      <p className='text-body text-muted-foreground'>{t('meter.title')}</p>
      <p className='mt-1 font-display text-figure leading-none font-semibold'>
        {money(spent)}
        <span className='text-lead text-muted-foreground'> / {money(limit)}</span>
      </p>
      <div className='mt-3 h-1 overflow-hidden rounded-full bg-border'>
        <div className='h-full bg-brand transition-[width] duration-500' style={{ width: `${Math.min(100, (spent / limit) * 100)}%` }} />
      </div>
    </div>
  );
};

export default ReplayMeterUi;
