import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';

type OverviewAllowanceMeterUiProps = {
  configured: boolean;
  spent: number;
  held: number;
  defaultLimit: number;
  onEdit: () => void;
};

const OverviewAllowanceMeterUi = ({ configured, spent, held, defaultLimit, onEdit }: OverviewAllowanceMeterUiProps) => {
  const { t } = useTranslation('overview-page');
  return (
    <>
      <div className='mt-10 flex items-baseline justify-between text-body'>
        <span>{t('allowance.title')}</span>
        <button type='button' className='text-body text-muted-foreground hover:text-foreground' onClick={onEdit}>
          {configured ? t('labels.edit') : t('labels.set-up')}
        </button>
      </div>
      <div className='mt-3 h-1.5 overflow-hidden rounded-full bg-border'>
        <i className='block h-full rounded-full bg-brand transition-[width] duration-500' style={{ width: `${held ? Math.min(100, (spent / held) * 100) : 0}%` }} />
      </div>
      <div className='mt-2 flex justify-between text-small text-muted-foreground tabular-nums'>
        <span>{t('allowance.spent', { amount: money(spent) })}</span>
        <span>{t('allowance.held', { amount: money(held), limit: defaultLimit })}</span>
      </div>
    </>
  );
};

export default OverviewAllowanceMeterUi;
