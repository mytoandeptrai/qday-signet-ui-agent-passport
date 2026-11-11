import { useGetActivityList } from '@/apis/activity';
import { useGetDepositList } from '@/apis/deposits';
import { useGetSessionList } from '@/apis/sessions';
import { useGetVoucherList } from '@/apis/vouchers';
import { PAGE_SIZE_OPTIONS } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { format, startOfDay, subDays } from 'date-fns';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  type ActivityRow,
  buildBuckets,
  buildRows,
  DEFAULT_METRIC,
  DEFAULT_RANGE_DAYS,
  downloadCsv,
  KIND_OF,
  METRICS,
  type Tab,
} from '../utils';

const route = getRouteApi('/(app)/activity');

export const useActivityContainer = () => {
  const { t } = useTranslation('activity-page');
  const search = route.useSearch();
  const navigate = useNavigate();
  const tab: Tab = search.tab ?? 'all';
  const days = search.range ?? DEFAULT_RANGE_DAYS;
  const page = search.page ?? 1;
  const pageSize = search.pageSize ?? PAGE_SIZE_OPTIONS[1];

  const { data: activity = [] } = useGetActivityList();
  const { data: sessions = [] } = useGetSessionList();
  const { data: deposits = [] } = useGetDepositList();
  const { data: vouchers = [] } = useGetVoucherList();
  const [metricId, setMetricId] = useState<Record<Tab, string>>(DEFAULT_METRIC);

  const all = useMemo(() => buildRows({ activity, sessions, deposits, vouchers, t }), [activity, sessions, deposits, vouchers, t]);

  const from = startOfDay(subDays(new Date(), days - 1));
  const rows = useMemo(() => {
    const kind = KIND_OF[tab];
    return all.filter((r) => (!kind || r.kind === kind) && new Date(r.createdAt) >= from);
    // `from` is derived from `days`
    // biome-ignore lint/correctness/useExhaustiveDependencies: see above
  }, [all, tab, days]);

  const metrics = METRICS[tab];
  const metric = metrics.find((m) => m.id === metricId[tab]) ?? metrics[0];
  const total = rows.reduce((n, r) => n + metric.value(r), 0);
  const formatValue = (n: number) => (metric.isMoney ? money(n) : String(n));

  const buckets = useMemo(
    () => buildBuckets(rows, metric, from),
    // biome-ignore lint/correctness/useExhaustiveDependencies: `from` is derived from `days`
    [rows, metric, days]
  );

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const [openRow, setOpenRow] = useState<ActivityRow | null>(null);

  const setSearch = (patch: Partial<typeof search>) =>
    navigate({ to: '/activity', search: { ...search, ...patch }, replace: true });

  const onTabChange = (next: Tab) => setSearch({ tab: next, page: 1 });
  const onRangeChange = (next: number) => setSearch({ range: next, page: 1 });
  const onMetricChange = (id: string) => setMetricId((m) => ({ ...m, [tab]: id }));
  const onPaginationChange = (nextPage: number, nextPageSize: number, action: 'pagination' | 'limiting') =>
    setSearch({ page: action === 'pagination' ? nextPage : 1, pageSize: nextPageSize });

  const onExportCsv = () => {
    downloadCsv(rows, `signet-activity-${tab}.csv`);
    toast.success(t('toasts.exported', { count: rows.length }));
  };

  return {
    t,
    tab,
    days,
    metrics,
    metric,
    figure: formatValue(total),
    hasData: total !== 0,
    rangeLabel: `${format(from, 'MMM d')}–${format(new Date(), days > 28 ? 'MMM d' : 'd')}`,
    fromLabel: format(from, 'MMM d'),
    toLabel: format(new Date(), 'MMM d'),
    buckets,
    formatValue,
    tableRows: rows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    totalRows: rows.length,
    pagination: { pageIndex: currentPage, pageSize, pageCount, hasNext: currentPage < pageCount, hasPrev: currentPage > 1 },
    openRow,
    onOpenRow: setOpenRow,
    onTabChange,
    onRangeChange,
    onMetricChange,
    onPaginationChange,
    onExportCsv,
  };
};
