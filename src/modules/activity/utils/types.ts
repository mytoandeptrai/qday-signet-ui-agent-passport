export type Tab = 'all' | 'sessions' | 'services' | 'transfers';
export type Kind = 'service' | 'session' | 'transfer';

export interface ActivityRow {
  id: string;
  kind: Kind;
  detail: string;
  sub: string;
  category: string;
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
