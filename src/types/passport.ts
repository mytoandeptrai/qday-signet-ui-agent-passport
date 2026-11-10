export type SessionStatus = 'active' | 'revoked' | 'expired' | 'completed';
export type ActivityStatus = 'settled' | 'blocked' | 'pending';
export type EscalationStatus = 'pending' | 'approved' | 'declined';
export type VoucherStatus = 'unused' | 'redeemed' | 'expired';
export type DepositMethod = 'card' | 'bank' | 'crypto';
export type DepositStatus = 'completed' | 'pending' | 'failed';
export type Appearance = 'light' | 'dark' | 'system';

export interface Passkey {
  id: string;
  label: string;
  createdAt: string;
  lastUsedAt: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  walletAddress: string;
  createdAt: string;
  passkeys: Passkey[];
}

export interface Balance {
  available: number;
  held: number;
  currency: 'USD';
}

export interface SpendingSession {
  id: string;
  task: string;
  agent: string;
  status: SessionStatus;
  limit: number;
  perCallLimit: number;
  spent: number;
  createdAt: string;
  expiresAt: string;
  allowedServices: string[];
}

export interface ActivityItem {
  id: string;
  sessionId: string;
  service: string;
  description: string;
  amount: number;
  status: ActivityStatus;
  /** Shown when status is `blocked`, e.g. "Over $5 per call". */
  reason?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  provider: string;
  /** Price of one call in USD. */
  pricePerCall: number;
  priceLabel: string;
  popular: boolean;
}

export interface Escalation {
  id: string;
  sessionId: string;
  agent: string;
  service: string;
  description: string;
  amount: number;
  status: EscalationStatus;
  requestedAt: string;
}

export interface Voucher {
  id: string;
  code: string;
  amount: number;
  status: VoucherStatus;
  createdAt: string;
  redeemedAt?: string;
}

export interface Deposit {
  id: string;
  method: DepositMethod;
  amount: number;
  status: DepositStatus;
  createdAt: string;
}

export interface AppSettings {
  defaultLimit: number;
  defaultPerCallLimit: number;
  emailAlerts: boolean;
  alertOnBlocked: boolean;
  requireApprovalAbove: number;
  appearance: Appearance;
}

export interface CreateSessionInput {
  task: string;
  agent: string;
  limit: number;
  perCallLimit: number;
  durationHours: number;
}

/** Landing-page content shapes. */
export interface LandingLedgerRow {
  service: string;
  amount: number;
  time: string;
  stopped?: boolean;
  note?: string;
}

export interface LandingMoment {
  time: string;
  text: string;
  service?: string;
  stopped?: boolean;
}

export type PlaygroundStepKind = 'prompt' | 'agent' | 'cmd' | 'out' | 'pay' | 'stop' | 'done';

export interface PlaygroundStep {
  kind: PlaygroundStepKind;
  text: string;
  /** Plain-language explanation shown beside the terminal. */
  note?: string;
  /** Money moved by this step. */
  amount?: number;
}

export interface PlaygroundScenario {
  id: string;
  title: string;
  summary: string;
  /** Prefill for the real create-session form. */
  task: string;
  limit: number;
  steps: PlaygroundStep[];
}
