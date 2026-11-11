import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/integrations/i18n';
import type { ActivityMetric } from '../../utils';

type ActivityMetricUiProps = {
  metrics: ActivityMetric[];
  metricId: string;
  figure: string;
  rangeLabel: string;
  onMetricChange: (id: string) => void;
};

const ActivityMetricUi = ({ metrics, metricId, figure, rangeLabel, onMetricChange }: ActivityMetricUiProps) => {
  const { t } = useTranslation('activity-page');
  return (
    <>
      <Select value={metricId} onValueChange={onMetricChange}>
        <SelectTrigger aria-label={t('metric.aria')} className='h-auto w-auto gap-1 border-0 bg-transparent p-0 text-body text-muted-foreground shadow-none'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {metrics.map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {t(`metrics.${m.id}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className='mt-1 font-display text-figure leading-none font-semibold tabular-nums'>{figure}</p>
      <p className='mt-2 text-small text-muted-foreground'>{rangeLabel}</p>
    </>
  );
};

export default ActivityMetricUi;
