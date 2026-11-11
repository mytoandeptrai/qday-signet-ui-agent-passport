import type { ActivityMetric, ActivityRow, Kind, Tab } from './types';

export const TABS = ['all', 'sessions', 'services', 'transfers'] as const;
export const RANGE_DAYS = [7, 30, 90] as const;
export const DEFAULT_RANGE_DAYS = 7;

export const KIND_OF: Record<Tab, Kind | null> = { all: null, sessions: 'session', services: 'service', transfers: 'transfer' };

const spend = (r: ActivityRow) => (r.kind === 'service' && !r.blocked ? Math.abs(r.amount) : 0);
const calls = (r: ActivityRow) => (r.kind === 'service' && !r.blocked ? 1 : 0);

export const METRICS: Record<Tab, ActivityMetric[]> = {
  all: [
    { id: 'spend', isMoney: true, value: spend },
    { id: 'calls', isMoney: false, value: calls },
  ],
  sessions: [
    { id: 'held', isMoney: true, value: (r) => r.amount },
    { id: 'count', isMoney: false, value: () => 1 },
  ],
  services: [
    { id: 'spend', isMoney: true, value: spend },
    { id: 'calls', isMoney: false, value: calls },
  ],
  transfers: [
    { id: 'added', isMoney: true, value: (r) => r.amount },
    { id: 'count', isMoney: false, value: () => 1 },
  ],
};

export const DEFAULT_METRIC: Record<Tab, string> = { all: 'spend', sessions: 'held', services: 'spend', transfers: 'added' };
