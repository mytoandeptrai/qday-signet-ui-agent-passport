import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NetworkKey } from '@/constant';
import { randomAddress } from '@/lib/address';
import { SEED_MAIN_WALLET, SEED_SETTINGS } from '@/mock/seed';
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
  SignetPass,
  SpendingSession,
  User,
} from '@/types/passport';

interface PassportState {
  user: User | null;
  passes: SignetPass[];
  selectedPassId: string | null;
  sessions: SpendingSession[];
  activity: ActivityItem[];
  escalations: Escalation[];
  deposits: Deposit[];
  settings: AppSettings;
  mainWallet: MainWallet;
  agents: Agent[];
  securityLog: SecurityEvent[];
  onboarding: { connected: boolean; allowance: boolean };

  signIn: (user: User) => void;
  signOut: () => void;
  createSignetPass: (input: { name: string; network: NetworkKey }) => SignetPass;
  selectPass: (id: string) => void;
  sendFromMain: (to: string, amount: number) => void;
  fundFromMain: (amount: number) => void;
  approveAgent: (id: string) => void;
  revokeAgent: (id: string) => void;
  recordWalletEvent: (type: 'wallet-connected' | 'wallet-disconnected', address: string) => void;
  createSession: (input: CreateSessionInput) => SpendingSession;
  revokeSession: (id: string) => void;
  decideEscalation: (id: string, approve: boolean) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  completeOnboarding: (step: 'connected' | 'allowance') => void;
  reset: () => void;
}

const uid = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
const now = () => new Date().toISOString();
const logged = (type: SecurityEventType, detail: string, log: SecurityEvent[]): SecurityEvent[] => [
  { id: uid('sec'), type, detail, createdAt: now() },
  ...log,
];

/** Applies a balance change to one pass. */
const withBalance = (passes: SignetPass[], id: string, change: (b: Balance) => Partial<Balance>) =>
  passes.map((p) => (p.id === id ? { ...p, balance: { ...p.balance, ...change(p.balance) } } : p));

export const selectedPass = (s: Pick<PassportState, 'passes' | 'selectedPassId'>) => s.passes.find((p) => p.id === s.selectedPassId) ?? null;

const requirePass = (s: PassportState) => {
  const pass = selectedPass(s);
  if (!pass) throw new Error('Create a SignetPass first');
  return pass;
};

const initial = () => ({
  passes: [] as SignetPass[],
  selectedPassId: null as string | null,
  sessions: [] as SpendingSession[],
  activity: [] as ActivityItem[],
  escalations: [] as Escalation[],
  deposits: [] as Deposit[],
  settings: SEED_SETTINGS,
  mainWallet: SEED_MAIN_WALLET,
  agents: [] as Agent[],
  securityLog: [] as SecurityEvent[],
  onboarding: { connected: false, allowance: false },
});

export const usePassportStore = create<PassportState>()(
  persist(
    (set, get) => ({
      user: null,
      ...initial(),

      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
      recordWalletEvent: (type, address) => set((s) => ({ securityLog: logged(type, address, s.securityLog) })),

      createSignetPass: ({ name, network }) => {
        const pass: SignetPass = {
          id: uid('pass'),
          name,
          address: randomAddress(),
          network,
          balance: { available: 0, held: 0, currency: 'USD' },
          createdAt: now(),
        };
        set((s) => ({
          passes: [...s.passes, pass],
          selectedPassId: pass.id,
          securityLog: logged('signetpass-created', `${name} · ${pass.address}`, s.securityLog),
        }));
        return pass;
      },

      selectPass: (id) => set((s) => (s.passes.some((p) => p.id === id) ? { selectedPassId: id } : s)),

      sendFromMain: (to, amount) =>
        set((s) => ({
          mainWallet: {
            balance: s.mainWallet.balance - amount,
            transactions: [{ id: uid('wtx'), kind: 'send', counterparty: to, amount, createdAt: now() }, ...s.mainWallet.transactions],
          },
          securityLog: logged('transfer', `-${amount} USD8 → ${to}`, s.securityLog),
        })),

      fundFromMain: (amount) => {
        const pass = requirePass(get());
        set((s) => ({
          mainWallet: {
            balance: s.mainWallet.balance - amount,
            transactions: [{ id: uid('wtx'), kind: 'fund', counterparty: pass.name, amount, createdAt: now() }, ...s.mainWallet.transactions],
          },
          deposits: [{ id: uid('dep'), passId: pass.id, method: 'wallet', amount, status: 'completed', createdAt: now() }, ...s.deposits],
          passes: withBalance(s.passes, pass.id, (b) => ({ available: b.available + amount })),
          securityLog: logged('transfer', `-${amount} USD8 → ${pass.name}`, s.securityLog),
        }));
      },

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
        const pass = requirePass(get());
        const session: SpendingSession = {
          id: uid('ses'),
          passId: pass.id,
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
          passes: withBalance(s.passes, pass.id, (b) => ({ available: b.available - input.limit, held: b.held + input.limit })),
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
            passes: withBalance(s.passes, target.passId, (b) => ({
              available: b.available + released,
              held: Math.max(0, b.held - released),
            })),
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
            passId: esc.passId,
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
            passes: withBalance(s.passes, esc.passId, (b) => ({ available: b.available - esc.amount })),
          };
        }),

      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      completeOnboarding: (step) => set((s) => ({ onboarding: { ...s.onboarding, [step]: true } })),

      reset: () => set({ ...initial() }),
    }),
    // v3: one account became several SignetPasses; older saved data is dropped for the new seed.
    { name: 'signet-passport-mock', version: 3 }
  )
);
