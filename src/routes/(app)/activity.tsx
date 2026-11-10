import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { money } from '@/lib/format';
import { cn } from '@/lib/utils';
import { usePassportStore } from '@/stores/passport-store';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { eachDayOfInterval, format, formatDistanceToNow, startOfDay, subDays } from 'date-fns';
import { Clock, Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

const TABS = ['all', 'sessions', 'services', 'transfers'] as const;
type Tab = (typeof TABS)[number];

export const Route = createFileRoute('/(app)/activity')({
  validateSearch: z.object({ tab: z.enum(TABS).optional().catch(undefined) }),
  component: Activity,
});

type Kind = 'service' | 'session' | 'transfer';

interface Row {
  id: string;
  kind: Kind;
  detail: string;
  sub: string;
  category: string;
  /** Signed: negative leaves the balance, positive arrives. Sessions hold funds, so they carry the limit. */
  amount: number;
  createdAt: string;
  status: string;
  blocked?: boolean;
}

interface Metric {
  id: string;
  label: string;
  isMoney: boolean;
  value: (r: Row) => number;
}

const spend = (r: Row) => (r.kind === 'service' && !r.blocked ? Math.abs(r.amount) : 0);
const calls = (r: Row) => (r.kind === 'service' && !r.blocked ? 1 : 0);

const METRICS: Record<Tab, Metric[]> = {
  all: [
    { id: 'spend', label: 'Spend', isMoney: true, value: spend },
    { id: 'calls', label: 'Paid calls', isMoney: false, value: calls },
  ],
  sessions: [
    { id: 'held', label: 'Budget approved', isMoney: true, value: (r) => r.amount },
    { id: 'count', label: 'Sessions', isMoney: false, value: () => 1 },
  ],
  services: [
    { id: 'spend', label: 'Spend', isMoney: true, value: spend },
    { id: 'calls', label: 'Paid calls', isMoney: false, value: calls },
  ],
  transfers: [
    { id: 'added', label: 'Funds added', isMoney: true, value: (r) => r.amount },
    { id: 'count', label: 'Transfers', isMoney: false, value: () => 1 },
  ],
};

const RANGES = [{ days: 7, label: '7 days' }, { days: 30, label: '30 days' }, { days: 90, label: '90 days' }];
const TAB_LABEL: Record<Tab, string> = { all: 'All', sessions: 'Sessions', services: 'Services', transfers: 'Transfers' };
const KIND_OF: Record<Tab, Kind | null> = { all: null, sessions: 'session', services: 'service', transfers: 'transfer' };
const PAGE = 10;

function Activity() {
  const tab = Route.useSearch().tab ?? 'all';
  const navigate = useNavigate();
  const { activity, sessions, deposits, vouchers } = usePassportStore();
  const [days, setDays] = useState(7);
  const [metricId, setMetricId] = useState<Record<Tab, string>>({ all: 'spend', sessions: 'held', services: 'spend', transfers: 'added' });
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<Row | null>(null);

  const all = useMemo<Row[]>(() => {
    const service: Row[] = activity.map((a) => ({
      id: a.id, kind: 'service', detail: a.service, sub: a.description, category: 'Service', amount: -a.amount,
      createdAt: a.createdAt, status: a.status, blocked: a.status === 'blocked',
    }));
    const session: Row[] = sessions.map((s) => ({
      id: s.id, kind: 'session', detail: s.task, sub: `${s.agent} · ${money(s.spent)} of ${money(s.limit)} used`, category: 'Session',
      amount: s.limit, createdAt: s.createdAt, status: s.status,
    }));
    const transfer: Row[] = [
      ...deposits.map((d): Row => ({ id: d.id, kind: 'transfer', detail: 'Added funds', sub: `By ${d.method}`, category: 'Deposit', amount: d.amount, createdAt: d.createdAt, status: d.status })),
      ...vouchers.filter((v) => v.status === 'redeemed').map((v): Row => ({ id: v.id, kind: 'transfer', detail: 'Voucher redeemed', sub: v.code, category: 'Voucher', amount: v.amount, createdAt: v.redeemedAt ?? v.createdAt, status: 'completed' })),
    ];
    return [...service, ...session, ...transfer].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [activity, sessions, deposits, vouchers]);

  const from = startOfDay(subDays(new Date(), days - 1));
  const rows = useMemo(() => {
    const kind = KIND_OF[tab];
    return all.filter((r) => (!kind || r.kind === kind) && new Date(r.createdAt) >= from);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, tab, days]);

  const metrics = METRICS[tab];
  const metric = metrics.find((m) => m.id === metricId[tab]) ?? metrics[0];
  const total = rows.reduce((n, r) => n + metric.value(r), 0);
  const fmt = (n: number) => (metric.isMoney ? money(n) : String(n));

  const buckets = useMemo(() => {
    const map = new Map(eachDayOfInterval({ start: from, end: new Date() }).map((d) => [format(d, 'yyyy-MM-dd'), 0]));
    for (const r of rows) {
      const key = format(new Date(r.createdAt), 'yyyy-MM-dd');
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + metric.value(r));
    }
    return [...map];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, metric, days]);
  const peak = Math.max(...buckets.map(([, v]) => v), 0);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const cur = Math.min(page, pages - 1);
  const rangeLabel = `${format(from, 'MMM d')}–${format(new Date(), days > 28 ? 'MMM d' : 'd')}`;

  const exportCsv = () => {
    const csv = ['id,type,detail,category,amount,status,created_at', ...rows.map((r) => [r.id, r.kind, `"${r.detail}"`, r.category, r.amount, r.status, r.createdAt].join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    Object.assign(document.createElement('a'), { href: url, download: `signet-activity-${tab}.csv` }).click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${rows.length} rows`);
  };

  return (
    <>
      <PageHeader title='Activity' action={<Button variant='outline' onClick={exportCsv}><Download /> Export CSV</Button>} />

      <div className='flex flex-wrap items-center justify-between gap-3 border-b'>
        <div role='tablist' className='-mb-px flex gap-6'>
          {TABS.map((t) => (
            <button
              key={t}
              type='button'
              role='tab'
              aria-selected={t === tab}
              onClick={() => { setPage(0); navigate({ to: '/activity', search: { tab: t }, replace: true }); }}
              className={cn('border-b-2 pb-3 text-body transition-colors', t === tab ? 'border-brand text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}
            >
              {TAB_LABEL[t]}
            </button>
          ))}
        </div>
        <Select value={String(days)} onValueChange={(v) => { setDays(Number(v)); setPage(0); }}>
          <SelectTrigger className='mb-2 w-32' aria-label='Date range'><Clock className='size-4 text-muted-foreground' /><SelectValue /></SelectTrigger>
          <SelectContent>{RANGES.map((r) => <SelectItem key={r.days} value={String(r.days)}>{r.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <section className='mt-6'>
        <Select value={metric.id} onValueChange={(v) => setMetricId((m) => ({ ...m, [tab]: v }))}>
          <SelectTrigger aria-label='Metric' className='h-auto w-auto gap-1 border-0 bg-transparent p-0 text-body text-muted-foreground shadow-none'><SelectValue /></SelectTrigger>
          <SelectContent>{metrics.map((m) => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}</SelectContent>
        </Select>
        <p className='mt-1 font-serif text-figure leading-none font-light tabular-nums'>{fmt(total)}</p>
        <p className='mt-2 text-small text-muted-foreground'>{rangeLabel}</p>

        <div className='mt-6 flex h-40 items-end gap-[3px]' role='img' aria-label={`${metric.label} per day`}>
          {total === 0 ? (
            <p className='m-auto text-body text-muted-foreground'>None yet.</p>
          ) : (
            buckets.map(([day, v]) => (
              <div key={day} title={`${format(new Date(day + 'T00:00'), 'MMM d')}: ${fmt(v)}`} className='group flex h-full flex-1 items-end'>
                <div className='w-full rounded-t-[2px] bg-brand/70 transition-colors group-hover:bg-brand' style={{ height: v ? `${Math.max(3, (v / peak) * 100)}%` : '2px', opacity: v ? 1 : 0.25 }} />
              </div>
            ))
          )}
        </div>
        <div className='mt-2 flex justify-between text-small text-muted-foreground'>
          <span>{format(from, 'MMM d')}</span>
          <span>{format(new Date(), 'MMM d')}</span>
        </div>
      </section>

      <div className='mt-8'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='px-0'>Detail</TableHead>
              <TableHead className='hidden sm:table-cell'>Category</TableHead>
              <TableHead className='text-right'>Amount</TableHead>
              <TableHead className='px-0 text-right'>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.slice(cur * PAGE, cur * PAGE + PAGE).map((r) => (
              <TableRow key={`${r.kind}-${r.id}`} className='cursor-pointer' onClick={() => setOpen(r)}>
                <TableCell className='px-0'><div className='font-medium'>{r.detail}</div><div className='text-caption text-muted-foreground'>{r.sub}</div></TableCell>
                <TableCell className='hidden text-muted-foreground sm:table-cell'>{r.category}</TableCell>
                <TableCell className={cn('text-right tabular-nums', r.blocked && 'text-muted-foreground line-through', r.kind === 'transfer' && 'text-success', r.kind === 'session' && 'text-muted-foreground')}>
                  {r.kind === 'service' ? '−' : r.kind === 'transfer' ? '+' : ''}{money(Math.abs(r.amount))}
                </TableCell>
                <TableCell className='px-0 text-right text-muted-foreground'>{formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}</TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && <TableRow><TableCell colSpan={4} className='px-0 py-6 text-muted-foreground'>None yet.</TableCell></TableRow>}
          </TableBody>
        </Table>
        {rows.length > PAGE && (
          <div className='mt-4 flex items-center justify-between text-body text-muted-foreground'>
            <span>{rows.length} entries</span>
            <div className='flex items-center gap-2'>
              <Button variant='outline' disabled={cur === 0} onClick={() => setPage(cur - 1)}>Previous</Button>
              <span className='tabular-nums'>{cur + 1} / {pages}</span>
              <Button variant='outline' disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={Boolean(open)} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{open?.detail}</DialogTitle>
            <DialogDescription>{open?.sub}</DialogDescription>
          </DialogHeader>
          {open && (
            <dl className='grid grid-cols-[110px_1fr] gap-y-3 text-body'>
              <dt className='text-muted-foreground'>Category</dt><dd>{open.category}</dd>
              <dt className='text-muted-foreground'>Amount</dt><dd className='tabular-nums'>{money(Math.abs(open.amount))}</dd>
              <dt className='text-muted-foreground'>Status</dt><dd><StatusBadge status={open.status} /></dd>
              {open.kind === 'service' && (() => {
                const a = activity.find((x) => x.id === open.id);
                const task = sessions.find((s) => s.id === a?.sessionId)?.task;
                return (<>
                  {a?.reason && (<><dt className='text-muted-foreground'>Reason</dt><dd className='text-danger'>{a.reason}</dd></>)}
                  {task && (<><dt className='text-muted-foreground'>Task</dt><dd>{task}</dd></>)}
                </>);
              })()}
              <dt className='text-muted-foreground'>Time</dt><dd>{new Date(open.createdAt).toLocaleString()}</dd>
              <dt className='text-muted-foreground'>Reference</dt><dd className='font-mono text-caption'>{open.id}</dd>
            </dl>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
