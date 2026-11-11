export type Tab = 'all' | 'sessions' | 'services' | 'transfers';
export type Kind = 'service' | 'session' | 'transfer';

export interface ActivityRow {
  id: string;
  kind: Kind;
  detail: string;
  sub: string;
  /** Translation key suffix: service | session | deposit | voucher. */
  category: string;
  /** Signed: negative leaves the balance, positive arrives. Sessions hold funds, so they carry the limit. */
  amount: number;
  createdAt: string;
  status: string;
  blocked?: boolean;
}

export interface ActivityMetric {
  id: string;
  isMoney: boolean;
  value: (row: ActivityRow) => number;
}
