import { ActivityChartUi, ActivityHeaderUi, ActivityMetricUi, ActivityTabsUi } from '../../components';
import { useActivityContainer } from '../../hooks';
import ActivityDetailDialogContainer from '../activity-detail-dialog-container';
import ActivityTableContainer from '../activity-table-container';

const ActivityContainer = () => {
  const {
    t,
    tab,
    days,
    metrics,
    metric,
    figure,
    hasData,
    rangeLabel,
    fromLabel,
    toLabel,
    buckets,
    formatValue,
    tableRows,
    pagination,
    openRow,
    onOpenRow,
    onTabChange,
    onRangeChange,
    onMetricChange,
    onPaginationChange,
    onExportCsv,
  } = useActivityContainer();

  return (
    <>
      <ActivityHeaderUi onExportCsv={onExportCsv} />
      <ActivityTabsUi tab={tab} days={days} onTabChange={onTabChange} onRangeChange={onRangeChange} />
      <section className='mt-6'>
        <ActivityMetricUi metrics={metrics} metricId={metric.id} figure={figure} rangeLabel={rangeLabel} onMetricChange={onMetricChange} />
        <ActivityChartUi
          label={t(`metrics.${metric.id}`)}
          buckets={buckets}
          hasData={hasData}
          fromLabel={fromLabel}
          toLabel={toLabel}
          formatValue={formatValue}
        />
      </section>
      <ActivityTableContainer rows={tableRows} pagination={pagination} onPaginationChange={onPaginationChange} onRowClick={onOpenRow} />
      <ActivityDetailDialogContainer row={openRow} onClose={() => onOpenRow(null)} />
    </>
  );
};

export default ActivityContainer;
