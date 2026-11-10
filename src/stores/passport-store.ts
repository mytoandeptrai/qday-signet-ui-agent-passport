import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  REDEEMABLE_CODES,
  SEED_ACTIVITY,
  SEED_BALANCE,
  SEED_DEPOSITS,
  SEED_ESCALATIONS,
  SEED_SESSIONS,
  SEED_SETTINGS,
  SEED_VOUCHERS,
} from '@/mock/seed';
import type {
  ActivityItem,
  AppSettings,
  Balance,
  CreateSessionInput,
  Deposit,
  DepositMethod,
  Escalation,
  SpendingSession,
  User,
  Voucher,
} from '@/types/passport';

interface PassportState {
  user: User | null;
  balance: Balance;
  sessions: SpendingSession[];
  activity: ActivityItem[];
  escalations: Escalation[];
  vouchers: Voucher[];
  deposits: Deposit[];
  settings: AppSettings;
  onboarding: { connected: boolean; allowance: boolean };

  signIn: (user: User) => void;
  signOut: () => void;
  createSession: (input: CreateSessionInput) => SpendingSession;
  revokeSession: (id: string) => void;
  decideEscalation: (id: string, approve: boolean) => void;
  deposit: (amount: number, method: DepositMethod) => void;
  redeemVoucher: (code: string) => { ok: true; amount: number } | { ok: false; error: string };
  updateSettings: (patch: Partial<AppSettings>) => void;
  completeOnboarding: (step: 'connected' | 'allowance') => void;
  addPasskey: (label: string) => void;
  removePasskey: (id: string) => void;
  reset: () => void;
}

const uid = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
const now = () => new Date().toISOString();

const initial = () => ({
  balance: SEED_BALANCE,
  sessions: SEED_SESSIONS,
  activity: SEED_ACTIVITY,
  escalations: SEED_ESCALATIONS,
  vouchers: SEED_VOUCHERS,
  deposits: SEED_DEPOSITS,
  settings: SEED_SETTINGS,
  onboarding: { connected: false, allowance: false },
});

export const usePassportStore = create<PassportState>()(
  persist(
    (set, get) => ({
      user: null,
      ...initial(),

      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),

      createSession: (input) => {
        const session: SpendingSession = {
          id: uid('ses'),
          task: input.task,
          agent: input.agent,
          status: 'active',
          limit: input.limit,
          perCallLimit: input.perCallLimit,
          spent: 0,
          createdAt: now(),
          expiresAt: new Date(Date.now() + input.durationHours * 3_600_000).toISOString(),
          allowedServices: [],
        };
        set((s) => ({
          sessions: [session, ...s.sessions],
          balance: { ...s.balance, available: s.balance.available - input.limit, held: s.balance.held + input.limit },
        }));
        return session;
      },

      revokeSession: (id) =>
        set((s) => {
          const target = s.sessions.find((x) => x.id === id);
          if (!target || target.status !== 'active') return s;
          const released = Math.max(0, target.limit - target.spent);
          return {
            sessions: s.sessions.map((x) => (x.id === id ? { ...x, status: 'revoked' } : x)),
            balance: {
              ...s.balance,
              available: s.balance.available + released,
              held: Math.max(0, s.balance.held - released),
            },
          };
        }),

      decideEscalation: (id, approve) =>
        set((s) => {
          const esc = s.escalations.find((e) => e.id === id);
          if (!esc || esc.status !== 'pending') return s;
          const escalations = s.escalations.map((e) => (e.id === id ? { ...e, status: approve ? 'approved' : 'declined' } : e)) as Escalation[];
          if (!approve) return { escalations };
          const item: ActivityItem = {
            id: uid('act'),
            sessionId: esc.sessionId,
            service: esc.service,
            description: esc.description,
            amount: esc.amount,
            status: 'settled',
            createdAt: now(),
          };
          return {
            escalations,
            activity: [item, ...s.activity],
            sessions: s.sessions.map((x) => (x.id === esc.sessionId ? { ...x, spent: x.spent + esc.amount, limit: Math.max(x.limit, x.spent + esc.amount) } : x)),
            balance: { ...s.balance, available: s.balance.available - esc.amount },
          };
        }),

      deposit: (amount, method) =>
        set((s) => ({
          deposits: [{ id: uid('dep'), method, amount, status: 'completed', createdAt: now() }, ...s.deposits],
          balance: { ...s.balance, available: s.balance.available + amount },
        })),

      redeemVoucher: (rawCode) => {
        const code = rawCode.trim().toUpperCase();
        const { vouchers } = get();
        const existing = vouchers.find((v) => v.code === code);
        if (existing && existing.status !== 'unused') return { ok: false, error: `This voucher is ${existing.status}.` };
        const amount = existing?.amount ?? REDEEMABLE_CODES[code];
        if (!amount) return { ok: false, error: 'That voucher code was not found.' };
        const redeemed: Voucher = { id: existing?.id ?? uid('vch'), code, amount, status: 'redeemed', createdAt: existing?.createdAt ?? now(), redeemedAt: now() };
        set((s) => ({
          vouchers: existing ? s.vouchers.map((v) => (v.id === existing.id ? redeemed : v)) : [redeemed, ...s.vouchers],
          balance: { ...s.balance, available: s.balance.available + amount },
        }));
        return { ok: true, amount };
      },

      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      completeOnboarding: (step) => set((s) => ({ onboarding: { ...s.onboarding, [step]: true } })),

      addPasskey: (label) =>
        set((s) => (s.user ? { user: { ...s.user, passkeys: [...s.user.passkeys, { id: uid('pk'), label, createdAt: now(), lastUsedAt: null }] } } : s)),
      removePasskey: (id) =>
        set((s) => (s.user ? { user: { ...s.user, passkeys: s.user.passkeys.filter((p) => p.id !== id) } } : s)),

      reset: () => set({ ...initial() }),
    }),
    { name: 'signet-passport-mock', version: 1 }
  )
);
