import { money, shortAddress } from '@/lib/format';
import type { ActivityItem, Deposit, SpendingSession, WalletTx } from '@/types/passport';
import type { TFunction } from 'i18next';
import type { ActivityRow } from './types';

interface BuildRowsParams {
  activity: ActivityItem[];
  sessions: SpendingSession[];
  deposits: Deposit[];
  walletTxs: WalletTx[];
  t: TFunction;
}

/** Merges service payments, sessions and money in into one newest-first list. */
export const buildRows = ({ activity, sessions, deposits, walletTxs, t }: BuildRowsParams): ActivityRow[] => {
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
        sub: t('rows.by-method', { method: t(`methods.${d.method}`) }),
        category: 'deposit',
        amount: d.amount,
        createdAt: d.createdAt,
        status: d.status,
      })
    ),
    // Funding the SignetPass is already a deposit row, so only money entering or leaving the Main Wallet is added here.
    ...walletTxs
      .filter((tx) => tx.kind !== 'fund')
      .map(
        (tx): ActivityRow => ({
          id: tx.id,
          kind: 'transfer',
          detail: t(`rows.wallet-${tx.kind}`),
          sub: shortAddress(tx.counterparty),
          category: 'wallet',
          amount: tx.kind === 'send' ? -tx.amount : tx.amount,
          createdAt: tx.createdAt,
          status: 'completed',
        })
      ),
  ];
  return [...service, ...session, ...transfer].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};
