import type {
  ActivityItem,
  AppSettings,
  Balance,
  Deposit,
  Escalation,
  SpendingSession,
  User,
  Voucher,
} from '@/types/passport';

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const hoursAhead = (h: number) => new Date(Date.now() + h * 3_600_000).toISOString();

export const SEED_USER: Omit<User, 'email'> = {
  id: 'usr_01',
  name: 'Alex Morgan',
  walletAddress: '0x7a3F9c2B41d0E5a6c8B19f0D3e24A7b5C6d81E90',
  createdAt: hoursAgo(24 * 40),
  passkeys: [
    { id: 'pk_1', label: 'MacBook Pro', createdAt: hoursAgo(24 * 40), lastUsedAt: hoursAgo(2) },
    { id: 'pk_2', label: 'iPhone', createdAt: hoursAgo(24 * 12), lastUsedAt: hoursAgo(30) },
  ],
};

export const SEED_BALANCE: Balance = { available: 142.5, held: 20, currency: 'USD' };

export const SEED_SESSIONS: SpendingSession[] = [
  {
    id: 'ses_team_dinner',
    task: 'Team dinner for 12',
    agent: 'Claude Code',
    status: 'active',
    limit: 20,
    perCallLimit: 5,
    spent: 3.26,
    createdAt: hoursAgo(3),
    expiresAt: hoursAhead(5),
    allowedServices: ['StablePhone', 'AgentRes', 'Hugen Weather', 'Signet Shopping'],
  },
  {
    id: 'ses_lead_gen',
    task: 'Find owners of 20 cafés',
    agent: 'Codex',
    status: 'active',
    limit: 10,
    perCallLimit: 1,
    spent: 4.8,
    createdAt: hoursAgo(26),
    expiresAt: hoursAhead(22),
    allowedServices: ['StableEnrich', 'EmailVerify'],
  },
  {
    id: 'ses_welcome_kit',
    task: 'Welcome kit for new hire',
    agent: 'Claude Code',
    status: 'completed',
    limit: 60,
    perCallLimit: 40,
    spent: 38.9,
    createdAt: hoursAgo(72),
    expiresAt: hoursAgo(48),
    allowedServices: ['Signet Shopping'],
  },
  {
    id: 'ses_thank_you',
    task: 'Printed thank-you letters',
    agent: 'Codex',
    status: 'revoked',
    limit: 15,
    perCallLimit: 2,
    spent: 2.3,
    createdAt: hoursAgo(120),
    expiresAt: hoursAgo(96),
    allowedServices: ['PostalForm'],
  },
];

export const SEED_ACTIVITY: ActivityItem[] = [
  { id: 'act_01', sessionId: 'ses_team_dinner', service: 'StablePhone', description: '6 calls to restaurants', amount: 3.24, status: 'settled', createdAt: hoursAgo(2.9) },
  { id: 'act_02', sessionId: 'ses_team_dinner', service: 'AgentRes', description: 'Booking for 12 at 19:30', amount: 0.01, status: 'settled', createdAt: hoursAgo(2.4) },
  { id: 'act_03', sessionId: 'ses_team_dinner', service: 'Hugen Weather', description: 'Forecast for Friday evening', amount: 0.01, status: 'settled', createdAt: hoursAgo(2.35) },
  { id: 'act_04', sessionId: 'ses_team_dinner', service: 'Signet Shopping', description: 'Amazon, table flowers', amount: 48, status: 'blocked', reason: 'Over $20 session limit', createdAt: hoursAgo(2.2) },
  { id: 'act_05', sessionId: 'ses_lead_gen', service: 'StableEnrich', description: 'Owner lookup, 20 cafés', amount: 0.8, status: 'settled', createdAt: hoursAgo(25) },
  { id: 'act_06', sessionId: 'ses_lead_gen', service: 'EmailVerify', description: 'Verified 20 emails', amount: 0.08, status: 'settled', createdAt: hoursAgo(24.8) },
  { id: 'act_07', sessionId: 'ses_lead_gen', service: 'StableEnrich', description: 'Second pass, 80 contacts', amount: 3.2, status: 'settled', createdAt: hoursAgo(24.5) },
  { id: 'act_08', sessionId: 'ses_welcome_kit', service: 'Signet Shopping', description: 'Welcome kit to the new hire', amount: 38.9, status: 'settled', createdAt: hoursAgo(70) },
  { id: 'act_09', sessionId: 'ses_welcome_kit', service: 'Signet Shopping', description: 'Office chair', amount: 189, status: 'blocked', reason: 'Over $40 per call', createdAt: hoursAgo(69) },
  { id: 'act_10', sessionId: 'ses_thank_you', service: 'PostalForm', description: 'Thank-you letter, 2 pages', amount: 1.15, status: 'settled', createdAt: hoursAgo(118) },
  { id: 'act_11', sessionId: 'ses_thank_you', service: 'PostalForm', description: 'Thank-you letter, 2 pages', amount: 1.15, status: 'settled', createdAt: hoursAgo(117) },
];

export const SEED_ESCALATIONS: Escalation[] = [
  {
    id: 'esc_01',
    sessionId: 'ses_team_dinner',
    agent: 'Claude Code',
    service: 'Signet Shopping',
    description: 'Amazon, table flowers',
    amount: 48,
    status: 'pending',
    requestedAt: hoursAgo(0.2),
  },
];

export const SEED_VOUCHERS: Voucher[] = [
  { id: 'vch_1', code: 'SIGNET-WELCOME-10', amount: 10, status: 'unused', createdAt: hoursAgo(24 * 5) },
  { id: 'vch_2', code: 'SIGNET-TEAM-25', amount: 25, status: 'redeemed', createdAt: hoursAgo(24 * 30), redeemedAt: hoursAgo(24 * 28) },
  { id: 'vch_3', code: 'SIGNET-BETA-5', amount: 5, status: 'expired', createdAt: hoursAgo(24 * 90) },
];

export const SEED_DEPOSITS: Deposit[] = [
  { id: 'dep_1', method: 'card', amount: 100, status: 'completed', createdAt: hoursAgo(24 * 14) },
  { id: 'dep_2', method: 'bank', amount: 50, status: 'completed', createdAt: hoursAgo(24 * 6) },
  { id: 'dep_3', method: 'crypto', amount: 12.5, status: 'pending', createdAt: hoursAgo(1) },
];

export const SEED_SETTINGS: AppSettings = {
  defaultLimit: 20,
  defaultPerCallLimit: 5,
  emailAlerts: true,
  alertOnBlocked: true,
  requireApprovalAbove: 25,
  appearance: 'light',
};

/** Vouchers a user may redeem (any code of this shape works in the mock). */
export const REDEEMABLE_CODES: Record<string, number> = {
  'SIGNET-WELCOME-10': 10,
  'SIGNET-FRIENDS-15': 15,
  'SIGNET-LAUNCH-50': 50,
};
