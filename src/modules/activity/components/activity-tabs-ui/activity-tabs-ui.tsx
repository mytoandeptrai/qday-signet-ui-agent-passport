import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { RANGE_DAYS, TABS, type Tab } from '../../utils';

type ActivityTabsUiProps = {
  tab: Tab;
  days: number;
  onTabChange: (tab: Tab) => void;
  onRangeChange: (days: number) => void;
};

const ActivityTabsUi = ({ tab, days, onTabChange, onRangeChange }: ActivityTabsUiProps) => {
  const { t } = useTranslation('activity-page');
  return (
    <div className='flex flex-wrap items-center justify-between gap-3 border-b'>
      <div role='tablist' className='-mb-px flex gap-6'>
        {TABS.map((id) => (
          <button
            key={id}
            type='button'
            role='tab'
            aria-selected={id === tab}
            onClick={() => onTabChange(id)}
            className={cn(
              'border-b-2 pb-3 text-body transition-colors',
              id === tab ? 'border-brand text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t(`tabs.${id}`)}
          </button>
        ))}
      </div>
      <Select value={String(days)} onValueChange={(v) => onRangeChange(Number(v))}>
        <SelectTrigger className='mb-2 w-32' aria-label={t('range.aria')}>
          <Clock className='size-4 text-muted-foreground' />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {RANGE_DAYS.map((d) => (
            <SelectItem key={d} value={String(d)}>
              {t('range.days', { count: d })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ActivityTabsUi;
