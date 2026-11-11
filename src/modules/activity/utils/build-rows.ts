import { money } from '@/lib/format';
import type { ActivityItem, Deposit, SpendingSession, Voucher } from '@/types/passport';
import type { TFunction } from 'i18next';
import type { ActivityRow } from './types';

interface BuildRowsParams {
  activity: ActivityItem[];
  sessions: SpendingSession[];
  deposits: Deposit[];
  vouchers: Voucher[];
  t: TFunction;
}

/** Merges service payments, sessions and money in into one newest-first list. */
export const buildRows = ({ activity, sessions, deposits, vouchers, t }: BuildRowsParams): ActivityRow[] => {
  const service: ActivityRow[] = activity.map((a) => ({
    id: a.id,
    kind: 'service',
    detail: a.service,
    sub: a.description,
    category: 'service',
    amount: -a.amount,
    createdAt: a.createdAt,
    status: a.status,
    blocked: a.status === 'blocked',
  }));
  const session: ActivityRow[] = sessions.map((s) => ({
    id: s.id,
    kind: 'session',
    detail: s.task,
    sub: t('rows.session-sub', { agent: s.agent, spent: money(s.spent), limit: money(s.limit) }),
    category: 'session',
    amount: s.limit,
    createdAt: s.createdAt,
    status: s.status,
  }));
  const transfer: ActivityRow[] = [
    ...deposits.map(
      (d): ActivityRow => ({
        id: d.id,
        kind: 'transfer',
        detail: t('rows.added-funds'),
        sub: t('rows.by-method', { method: d.method }),
        category: 'deposit',
        amount: d.amount,
        createdAt: d.createdAt,
        status: d.status,
      })
    ),
    ...vouchers
      .filter((v) => v.status === 'redeemed')
      .map(
        (v): ActivityRow => ({
          id: v.id,
          kind: 'transfer',
          detail: t('rows.voucher-redeemed'),
          sub: v.code,
          category: 'voucher',
          amount: v.amount,
          createdAt: v.redeemedAt ?? v.createdAt,
          status: 'completed',
        })
      ),
  ];
  return [...service, ...session, ...transfer].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};
