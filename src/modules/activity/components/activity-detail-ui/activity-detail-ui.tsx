import { StatusBadge } from '@/components/app/status-badge';
import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';
import type { ActivityRow } from '../../utils';

type ActivityDetailUiProps = {
  row: ActivityRow;
  reason?: string;
  task?: string;
};

const ActivityDetailUi = ({ row, reason, task }: ActivityDetailUiProps) => {
  const { t } = useTranslation('activity-page');
  return (
    <dl className='grid grid-cols-[110px_1fr] gap-y-3 text-body'>
      <dt className='text-muted-foreground'>{t('detail.category')}</dt>
      <dd>{t(`categories.${row.category}`)}</dd>
      <dt className='text-muted-foreground'>{t('detail.amount')}</dt>
      <dd className='tabular-nums'>{money(Math.abs(row.amount))}</dd>
      <dt className='text-muted-foreground'>{t('detail.status')}</dt>
      <dd>
        <StatusBadge status={row.status} />
      </dd>
      {reason && (
        <>
          <dt className='text-muted-foreground'>{t('detail.reason')}</dt>
          <dd className='text-danger'>{reason}</dd>
        </>
      )}
      {task && (
        <>
          <dt className='text-muted-foreground'>{t('detail.task')}</dt>
          <dd>{task}</dd>
        </>
      )}
      <dt className='text-muted-foreground'>{t('detail.time')}</dt>
      <dd>{new Date(row.createdAt).toLocaleString()}</dd>
      <dt className='text-muted-foreground'>{t('detail.reference')}</dt>
      <dd className='font-mono text-caption'>{row.id}</dd>
    </dl>
  );
};

export default ActivityDetailUi;
