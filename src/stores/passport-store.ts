import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  REDEEMABLE_CODES,
  SEED_ACTIVITY,
  SEED_AGENTS,
  SEED_BALANCE,
  SEED_DEPOSITS,
  SEED_MAIN_WALLET,
  SEED_ESCALATIONS,
  SEED_SESSIONS,
  SEED_SETTINGS,
  SEED_SIGNETPASS,
  SEED_VOUCHERS,
} from '@/mock/seed';
import type { WalletSession } from '@/integrations/wallet/types';
import type {
  ActivityItem,
  Agent,
  AppSettings,
  Balance,
  CreateSessionInput,
  Deposit,
  Escalation,
  MainWallet,
  SecurityEvent,
  SecurityEventType,
  SignetPassAccount,
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
  wallet: WalletSession | null;
  mainWallet: MainWallet;
  signetPass: SignetPassAccount;
  agents: Agent[];
  securityLog: SecurityEvent[];
  onboarding: { connected: boolean; allowance: boolean };

  signIn: (user: User) => void;
  signOut: () => void;
  createSignetPass: () => void;
  sendFromMain: (to: string, amount: number) => void;
  fundFromMain: (amount: number) => void;
  approveAgent: (id: string) => void;
  revokeAgent: (id: string) => void;
  setWallet: (wallet: WalletSession | null) => void;
  createSession: (input: CreateSessionInput) => SpendingSession;
  revokeSession: (id: string) => void;
  decideEscalation: (id: string, approve: boolean) => void;
  redeemVoucher: (code: string) => { ok: true; amount: number } | { ok: false; error: string };
  updateSettings: (patch: Partial<AppSettings>) => void;
  completeOnboarding: (step: 'connected' | 'allowance') => void;
  addPasskey: (label: string) => void;
  removePasskey: (id: string) => void;
  reset: () => void;
}

const uid = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
const now = () => new Date().toISOString();
const logged = (type: SecurityEventType, detail: string, log: SecurityEvent[]): SecurityEvent[] => [
  { id: uid('sec'), type, detail, createdAt: now() },
  ...log,
];

const initial = () => ({
  balance: SEED_BALANCE,
  sessions: SEED_SESSIONS,
  activity: SEED_ACTIVITY,
  escalations: SEED_ESCALATIONS,
  vouchers: SEED_VOUCHERS,
  deposits: SEED_DEPOSITS,
  settings: SEED_SETTINGS,
  wallet: null,
  mainWallet: SEED_MAIN_WALLET,
  signetPass: SEED_SIGNETPASS,
  agents: SEED_AGENTS,
  securityLog: [] as SecurityEvent[],
  onboarding: { connected: false, allowance: false },
});

export const usePassportStore = create<PassportState>()(
  persist(
    (set, get) => ({
      user: null,
      ...initial(),

      signIn: (user) => set({ user }),
      signOut: () => set({ user: null, wallet: null }),
      setWallet: (wallet) =>
        set((s) => ({
          wallet,
          securityLog: wallet
            ? logged('wallet-connected', wallet.address, s.securityLog)
            : logged('wallet-disconnected', s.wallet?.address ?? '', s.securityLog),
        })),

      createSignetPass: () =>
        set((s) => ({
          signetPass: { created: true, createdAt: now() },
          securityLog: logged('signetpass-created', s.user?.walletAddress ?? '', s.securityLog),
        })),

      sendFromMain: (to, amount) =>
        set((s) => ({
          mainWallet: {
            balance: s.mainWallet.balance - amount,
            transactions: [{ id: uid('wtx'), kind: 'send', counterparty: to, amount, createdAt: now() }, ...s.mainWallet.transactions],
          },
          securityLog: logged('transfer', `-${amount} USD8 → ${to}`, s.securityLog),
        })),

      fundFromMain: (amount) =>
        set((s) => ({
          mainWallet: {
            balance: s.mainWallet.balance - amount,
            transactions: [{ id: uid('wtx'), kind: 'fund', counterparty: 'SignetPass', amount, createdAt: now() }, ...s.mainWallet.transactions],
          },
          deposits: [{ id: uid('dep'), method: 'wallet', amount, status: 'completed', createdAt: now() }, ...s.deposits],
          balance: { ...s.balance, available: s.balance.available + amount },
          securityLog: logged('transfer', `-${amount} USD8 → SignetPass`, s.securityLog),
        })),

      approveAgent: (id) =>
        set((s) => ({
          agents: s.agents.map((a) => (a.id === id ? { ...a, status: 'active', approvedAt: now() } : a)),
          securityLog: logged('agent-approved', s.agents.find((a) => a.id === id)?.name ?? id, s.securityLog),
        })),

      revokeAgent: (id) =>
        set((s) => ({
          agents: s.agents.map((a) => (a.id === id ? { ...a, status: 'revoked' } : a)),
          securityLog: logged('agent-revoked', s.agents.find((a) => a.id === id)?.name ?? id, s.securityLog),
        })),

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
          securityLog: logged('session-created', input.task, s.securityLog),
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
            securityLog: logged('session-revoked', target.task, s.securityLog),
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
