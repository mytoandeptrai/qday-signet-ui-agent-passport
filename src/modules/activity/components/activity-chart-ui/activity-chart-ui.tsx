import { useTranslation } from '@/integrations/i18n';
import { format } from 'date-fns';

type ActivityChartUiProps = {
  label: string;
  buckets: [string, number][];
  hasData: boolean;
  fromLabel: string;
  toLabel: string;
  formatValue: (n: number) => string;
};

const ActivityChartUi = ({ label, buckets, hasData, fromLabel, toLabel, formatValue }: ActivityChartUiProps) => {
  const { t } = useTranslation('activity-page');
  const peak = Math.max(...buckets.map(([, v]) => v), 0);
  return (
    <>
      <div className='mt-6 flex h-40 items-end gap-0.75' role='img' aria-label={t('chart.aria', { metric: label })}>
        {!hasData ? (
          <p className='m-auto text-body text-muted-foreground'>{t('empty')}</p>
        ) : (
          buckets.map(([day, v]) => (
            <div key={day} title={`${format(new Date(`${day}T00:00`), 'MMM d')}: ${formatValue(v)}`} className='group flex h-full flex-1 items-end'>
              <div
                className='w-full rounded-t-xs bg-brand/70 transition-colors group-hover:bg-brand'
                style={{ height: v ? `${Math.max(3, (v / peak) * 100)}%` : '2px', opacity: v ? 1 : 0.25 }}
              />
            </div>
          ))
        )}
      </div>
      <div className='mt-2 flex justify-between text-small text-muted-foreground'>
        <span>{fromLabel}</span>
        <span>{toLabel}</span>
      </div>
    </>
  );
};

export default ActivityChartUi;
