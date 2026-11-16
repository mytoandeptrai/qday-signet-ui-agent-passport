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
  /** Paid calls in the last 30 days; "most popular" sorts by it. */
  sales: number;
  /** x402 endpoint an agent calls. */
  endpoint: string;
  /** Tokens the service accepts, e.g. "USDC (Base)". */
  currencies: string[];
  /** Remaining columns of the Bazaar row, shown under "More details". */
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
  /** Global: when on, every approval needs a MetaMask signature. Missing in older persisted state means on. */
  passkeyEnabled?: boolean;
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
  /** Dollars paid, or the amount that was refused when `stopped`. */
  amount?: number;
  stopped?: boolean;
}

/** The terminal only shows `you` and `agent`; `event` is what the Trellis Wallet does, shown beside it. */
export type PlaygroundStepKind = 'you' | 'agent' | 'event';

export type PlaygroundEventTone = 'info' | 'approval' | 'payment';

export interface PlaygroundStep {
  kind: PlaygroundStepKind;
  text: string;
  /** Only for `event` steps. */
  tone?: PlaygroundEventTone;
  /** Money moved by a `payment` event. */
  amount?: number;
}

export interface PlaygroundScenario {
  id: string;
  title: string;
  summary: string;
  /** Prefill for the real create-session form. */
  task: string;
  /** Spending cap the meter counts against, in USDC. */
  limit: number;
  /** True when the agent works inside a spending session rather than paying once. */
  session?: boolean;
  steps: PlaygroundStep[];
}

export type WalletTxKind = 'send' | 'receive' | 'fund' | 'fee' | 'purchase';

export interface WalletTx {
  id: string;
  kind: WalletTxKind;
  /** Recipient for `send`, sender for `receive`, the SignetPass name for `fund` and `fee`, the order id for `purchase`. */
  counterparty: string;
  amount: number;
  createdAt: string;
}

/** The Main Wallet is the EOA the user connects with MetaMask. It holds one balance per network: stablecoin only. */
export interface MainWallet {
  balance: number;
  transactions: WalletTx[];
}

export type SignetPassStatus = 'inactive' | 'active';

/** An agent spending account on one network; its token (USDC on Base, USD8 on QDay) follows the network. */
export interface SignetPass {
  id: string;
  name: string;
  address: string;
  /** Main Wallet (EOA, lowercase) that created the pass and pays for it. */
  owner: string;
  network: NetworkKey;
  /** A new pass is `inactive` until the owner activates it (deploys the smart account; the creation fee is already paid). Only an active pass can hold funds or start sessions. */
  status: SignetPassStatus;
  balance: Balance;
  createdAt: string;
}

export type ShopOrderStatus = 'paid' | 'shipped' | 'delivered';

/** A Shopping purchase paid from the Main Wallet or an active SignetPass of the same owner and network. */
export interface ShopOrder {
  id: string;
  owner: string;
  network: NetworkKey;
  /** The SignetPass that paid, or null when the Main Wallet did. */
  passId: string | null;
  /** Name of the account that paid, kept as it was at checkout. */
  paidFrom: string;
  status: ShopOrderStatus;
  lines: { productId: string; name: string; price: string; quantity: number }[];
  /** Total as a decimal string. */
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
