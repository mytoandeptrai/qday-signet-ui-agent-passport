import type { NetworkKey } from '@/constant';

export type SessionStatus = 'active' | 'revoked' | 'expired' | 'completed';
export type ActivityStatus = 'settled' | 'blocked' | 'pending';
export type EscalationStatus = 'pending' | 'approved' | 'declined';
export type DepositMethod = 'card' | 'bank' | 'crypto' | 'wallet';
export type DepositStatus = 'completed' | 'pending' | 'failed';
export type Appearance = 'light' | 'dark' | 'system';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Balance {
  available: number;
  held: number;
  currency: 'USD';
}

export interface SpendingSession {
  id: string;
  passId: string;
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
  passId: string;
  sessionId: string;
  service: string;
  description: string;
  amount: number;
  status: ActivityStatus;
  reason?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  provider: string;
  pricePerCall: number;
  priceLabel: string;
  popular: boolean;
  sales: number;
  endpoint: string;
  currencies: string[];
  details: Record<string, string>;
}

export interface Escalation {
  id: string;
  passId: string;
  sessionId: string;
  agent: string;
  service: string;
  description: string;
  amount: number;
  status: EscalationStatus;
  requestedAt: string;
}

export interface Deposit {
  id: string;
  passId: string;
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
  passkeyEnabled?: boolean;
}

export interface CreateSessionInput {
  task: string;
  agent: string;
  limit: number;
  perCallLimit: number;
  durationHours: number;
}

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
  amount?: number;
  stopped?: boolean;
}

export type PlaygroundStepKind = 'you' | 'agent' | 'event';

export type PlaygroundEventTone = 'info' | 'approval' | 'payment';

export interface PlaygroundStep {
  kind: PlaygroundStepKind;
  text: string;
  tone?: PlaygroundEventTone;
  amount?: number;
}

export interface PlaygroundScenario {
  id: string;
  title: string;
  summary: string;
  task: string;
  limit: number;
  session?: boolean;
  steps: PlaygroundStep[];
}

export type WalletTxKind = 'send' | 'receive' | 'fund' | 'fee' | 'purchase';

export interface WalletTx {
  id: string;
  kind: WalletTxKind;
  counterparty: string;
  amount: number;
  createdAt: string;
}

export interface MainWallet {
  balance: number;
  transactions: WalletTx[];
}

export type SignetPassStatus = 'inactive' | 'active';

export interface SignetPass {
  id: string;
  name: string;
  address: string;
  owner: string;
  network: NetworkKey;
  status: SignetPassStatus;
  balance: Balance;
  createdAt: string;
}

export type ShopOrderStatus = 'paid' | 'shipped' | 'delivered';

export interface EcommerceAccount {
  email: string;
  name: string;
  shippingAddress: string;
}

export interface ShopOrder {
  id: string;
  owner: string;
  network: NetworkKey;
  passId: string | null;
  paidFrom: string;
  status: ShopOrderStatus;
  lines: { productId: string; name: string; price: string; quantity: number }[];
  total: string;
  shipTo: string;
  createdAt: string;
}

export type AgentStatus = 'pending' | 'active' | 'revoked';

export interface Agent {
  id: string;
  passId: string;
  name: string;
  status: AgentStatus;
  requestedAt: string;
  approvedAt?: string;
}

export type SecurityEventType =
  | 'wallet-connected'
  | 'wallet-disconnected'
  | 'signetpass-created'
  | 'signetpass-activated'
  | 'transfer'
  | 'shop-order'
  | 'agent-approved'
  | 'agent-revoked'
  | 'session-created'
  | 'session-revoked';

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  detail: string;
  createdAt: string;
}
