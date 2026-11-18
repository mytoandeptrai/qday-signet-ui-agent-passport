import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_NETWORK, NETWORKS, PASS_FEE, type NetworkKey } from '@/constant';
import { randomAddress } from '@/lib/address';
import { SEED_MAIN_WALLET, SEED_SETTINGS } from '@/mock/seed';
import {
  type CartLine,
  addToCart as addLine,
  budgetLeft,
  cartTotal,
  cartTotalAmount,
  checkoutProblem,
  formatAtomic,
  pricedCart,
  removeFromCart as removeLine,
  sessionProblem,
  setQuantity as setLineQuantity,
} from '@/modules/shopping/utils';
import type {
  ActivityItem,
  Agent,
  AgentStatus,
  EcommerceAccount,
  AppSettings,
  Balance,
  CreateSessionInput,
  Deposit,
  Escalation,
  MainWallet,
  SecurityEvent,
  SecurityEventType,
  ShopOrder,
  ShopOrderStatus,
  SignetPass,
  SpendingSession,
  User,
} from '@/types/passport';

interface WalletContext {
  address: string | null;
  network: NetworkKey;
}

interface PassportState {
  user: User | null;
  context: WalletContext;
  mainWallets: Record<string, MainWallet>;
  passes: SignetPass[];
  selectedPassId: string | null;
  sessions: SpendingSession[];
  activity: ActivityItem[];
  escalations: Escalation[];
  deposits: Deposit[];
  cart: CartLine[];
  orders: ShopOrder[];
  ecommerceAccounts: Record<string, EcommerceAccount>;
  settings: AppSettings;
  agents: Agent[];
  securityLog: SecurityEvent[];
  onboarding: { connected: boolean; allowance: boolean };

  signIn: (user: User) => void;
  signOut: () => void;
  setContext: (address: string | null, network: NetworkKey) => void;
  createSignetPass: (input: { name: string }) => SignetPass;
  activateSignetPass: (id: string) => void;
  renamePass: (id: string, name: string) => void;
  selectPass: (id: string) => void;
  sendFromMain: (to: string, amount: number) => void;
  fundFromMain: (amount: number) => void;
  addToCart: (productId: string) => void;
  setCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  placeOrder: (input: { sessionId: string }) => ShopOrder;
  loginEcommerce: (account: EcommerceAccount) => void;
  logoutEcommerce: () => void;
  setOrderStatus: (id: string, from: ShopOrderStatus, to: ShopOrderStatus) => void;
  clearShop: () => void;
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

/** Mock: the agents a backend would already list for a freshly activated pass. */
const mockAgents = (passId: string): Agent[] =>
  [
    { name: 'Claude Code', status: 'active' },
    { name: 'Codex', status: 'active' },
    { name: 'Cursor', status: 'pending' },
  ].map(({ name, status }) => ({
    id: uid('agt'),
    passId,
    name,
    status: status as AgentStatus,
    requestedAt: now(),
    ...(status === 'active' && { approvedAt: now() }),
  }));

const logged = (type: SecurityEventType, detail: string, log: SecurityEvent[]): SecurityEvent[] => [
  { id: uid('sec'), type, detail, createdAt: now() },
  ...log,
];

const withBalance = (passes: SignetPass[], id: string, change: (b: Balance) => Partial<Balance>) =>
  passes.map((p) => (p.id === id ? { ...p, balance: { ...p.balance, ...change(p.balance) } } : p));

const walletKey = (c: WalletContext) => `${c.address}:${c.network}`;

const provision = (wallets: Record<string, MainWallet>, c: WalletContext) =>
  c.address && !wallets[walletKey(c)] ? { ...wallets, [walletKey(c)]: structuredClone(SEED_MAIN_WALLET) } : wallets;

export const currentMainWallet = (s: Pick<PassportState, 'context' | 'mainWallets'>) => (s.context.address ? (s.mainWallets[walletKey(s.context)] ?? null) : null);

export const visiblePasses = (s: Pick<PassportState, 'passes' | 'context'>) =>
  s.passes.filter((p) => p.owner === s.context.address && p.network === s.context.network);

export const selectedPass = (s: Pick<PassportState, 'passes' | 'selectedPassId' | 'context'>) => {
  const visible = visiblePasses(s);
  return visible.find((p) => p.id === s.selectedPassId) ?? visible[0] ?? null;
};

const requireWallet = (s: PassportState) => {
  const wallet = currentMainWallet(s);
  if (!wallet) throw new Error('Connect a wallet first');
  return wallet;
};

const withWallet = (s: PassportState, change: (w: MainWallet) => MainWallet) => ({
  mainWallets: { ...s.mainWallets, [walletKey(s.context)]: change(requireWallet(s)) },
});

export const visibleOrders = (s: Pick<PassportState, 'orders' | 'context'>) =>
  s.orders.filter((o) => o.owner === s.context.address && o.network === s.context.network);

export const currentEcommerceAccount = (s: Pick<PassportState, 'ecommerceAccounts' | 'context'>) =>
  s.context.address ? (s.ecommerceAccounts[s.context.address] ?? null) : null;

const requirePass = (s: PassportState) => {
  const pass = selectedPass(s);
  if (!pass) throw new Error('Create a SignetPass first');
  return pass;
};

const requireActivePass = (s: PassportState) => {
  const pass = requirePass(s);
  if (pass.status !== 'active') throw new Error('Activate the SignetPass first');
  return pass;
};

const initial = () => ({
  mainWallets: {} as Record<string, MainWallet>,
  passes: [] as SignetPass[],
  selectedPassId: null as string | null,
  sessions: [] as SpendingSession[],
  activity: [] as ActivityItem[],
  escalations: [] as Escalation[],
  deposits: [] as Deposit[],
  cart: [] as CartLine[],
  orders: [] as ShopOrder[],
  ecommerceAccounts: {} as Record<string, EcommerceAccount>,
  settings: SEED_SETTINGS,
  agents: [] as Agent[],
  securityLog: [] as SecurityEvent[],
  onboarding: { connected: false, allowance: false },
});

export const usePassportStore = create<PassportState>()(
  persist(
    (set, get) => ({
      user: null,
      context: { address: null, network: DEFAULT_NETWORK } as WalletContext,
      ...initial(),

      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
      recordWalletEvent: (type, address) => set((s) => ({ securityLog: logged(type, address, s.securityLog) })),

      setContext: (address, network) =>
        set((s) => {
          const context = { address, network };
          return { context, mainWallets: provision(s.mainWallets, context) };
        }),

      createSignetPass: ({ name }) => {
        const state = get();
        if (requireWallet(state).balance < PASS_FEE) throw new Error('Not enough balance for the SignetPass fee');
        const { address, network } = state.context;
        const pass: SignetPass = {
          id: uid('pass'),
          name,
          address: randomAddress(),
          owner: address as string,
          network,
          status: 'inactive',
          balance: { available: 0, held: 0, currency: 'USD' },
          createdAt: now(),
        };
        set((s) => ({
          passes: [...s.passes, pass],
          selectedPassId: pass.id,
          ...withWallet(s, (w) => ({
            balance: w.balance - PASS_FEE,
            transactions: [{ id: uid('wtx'), kind: 'fee', counterparty: name, amount: PASS_FEE, createdAt: now() }, ...w.transactions],
          })),
          securityLog: logged('signetpass-created', `${name} · ${pass.address}`, s.securityLog),
        }));
        return pass;
      },

      activateSignetPass: (id) => {
        const state = get();
        const pass = visiblePasses(state).find((p) => p.id === id);
        if (!pass) throw new Error('SignetPass not found');
        if (pass.status === 'active') return;
        set((s) => ({
          passes: s.passes.map((p) => (p.id === id ? { ...p, status: 'active' } : p)),
          agents: [...mockAgents(id), ...s.agents],
          securityLog: logged('signetpass-activated', `${pass.name} · ${pass.address}`, s.securityLog),
        }));
      },

      renamePass: (id, name) => set((s) => ({ passes: s.passes.map((p) => (p.id === id ? { ...p, name: name.trim() } : p)) })),

      selectPass: (id) => set((s) => (visiblePasses(s).some((p) => p.id === id) ? { selectedPassId: id } : s)),

      sendFromMain: (to, amount) =>
        set((s) => ({
          ...withWallet(s, (w) => ({
            balance: w.balance - amount,
            transactions: [{ id: uid('wtx'), kind: 'send', counterparty: to, amount, createdAt: now() }, ...w.transactions],
          })),
          securityLog: logged('transfer', `-${amount} ${NETWORKS[s.context.network].token.symbol} → ${to}`, s.securityLog),
        })),

      fundFromMain: (amount) => {
        const pass = requireActivePass(get());
        set((s) => ({
          ...withWallet(s, (w) => ({
            balance: w.balance - amount,
            transactions: [{ id: uid('wtx'), kind: 'fund', counterparty: pass.name, amount, createdAt: now() }, ...w.transactions],
          })),
          deposits: [{ id: uid('dep'), passId: pass.id, method: 'wallet', amount, status: 'completed', createdAt: now() }, ...s.deposits],
          passes: withBalance(s.passes, pass.id, (b) => ({ available: b.available + amount })),
          securityLog: logged('transfer', `-${amount} ${NETWORKS[pass.network].token.symbol} → ${pass.name}`, s.securityLog),
        }));
      },

      addToCart: (productId) => set((s) => ({ cart: addLine(s.cart, productId) })),

      setCartQuantity: (productId, quantity) => set((s) => ({ cart: setLineQuantity(s.cart, productId, quantity) })),

      removeFromCart: (productId) => set((s) => ({ cart: removeLine(s.cart, productId) })),

      placeOrder: ({ sessionId }) => {
        const state = get();
        requireWallet(state);
        const { address, network } = state.context;
        const account = currentEcommerceAccount(state);
        if (!account?.shippingAddress) throw new Error('No shipping address available');
        const session = state.sessions.find((x) => x.id === sessionId);
        const pass = session && visiblePasses(state).find((p) => p.id === session.passId);
        if (!session || !pass) throw new Error('Spending session not found');
        if (pass.status !== 'active' || session.status !== 'active') throw new Error('Spending session is not active');
        const problem = checkoutProblem(state.cart, network, budgetLeft(session));
        if (problem) throw new Error(`Cannot check out: ${problem.code}`);
        const lines = pricedCart(state.cart, network);
        const amount = cartTotalAmount(lines);
        const sessionIssue = sessionProblem(session, amount, Date.now());
        if (sessionIssue) throw new Error(`Cannot check out: ${sessionIssue}`);
        const order: ShopOrder = {
          id: `ORD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          owner: address as string,
          network,
          passId: pass.id,
          paidFrom: `${session.agent} (${pass.name})`,
          status: 'paid',
          lines: lines.map(({ product, quantity }) => ({ productId: product.id, name: product.name, price: product.price, quantity })),
          total: formatAtomic(cartTotal(lines)),
          shipTo: `${account.name} · ${account.shippingAddress}`,
          createdAt: now(),
        };
        const item: ActivityItem = {
          id: uid('act'),
          passId: pass.id,
          sessionId: session.id,
          service: 'Shopping',
          description: order.id,
          amount,
          status: 'settled',
          createdAt: now(),
        };
        set((s) => ({
          cart: [],
          orders: [order, ...s.orders],
          activity: [item, ...s.activity],
          sessions: s.sessions.map((x) => (x.id === session.id ? { ...x, spent: x.spent + amount } : x)),
          // The session's limit was held when it was created, so paying spends from what is held.
          passes: withBalance(s.passes, pass.id, (b) => ({ held: Math.max(0, b.held - amount) })),
          securityLog: logged('shop-order', `${order.id} · -${order.total} ${NETWORKS[network].token.symbol} · ${order.paidFrom}`, s.securityLog),
        }));
        return order;
      },

      loginEcommerce: (account) =>
        set((s) => (s.context.address ? { ecommerceAccounts: { ...s.ecommerceAccounts, [s.context.address]: account } } : s)),

      logoutEcommerce: () =>
        set((s) => {
          if (!s.context.address) return s;
          const { [s.context.address]: _gone, ...rest } = s.ecommerceAccounts;
          return { ecommerceAccounts: rest };
        }),

      setOrderStatus: (id, from, to) => set((s) => ({ orders: s.orders.map((o) => (o.id === id && o.status === from ? { ...o, status: to } : o)) })),

      clearShop: () => set((s) => ({ cart: [], orders: s.orders.filter((o) => !visibleOrders(s).includes(o)) })),

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
        const pass = requireActivePass(get());
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
        set((s) => {
          // An agent has one active session: a new one replaces it and gives back what it had not spent.
          const replaced = s.sessions.filter((x) => x.passId === pass.id && x.agent === input.agent && x.status === 'active');
          const released = replaced.reduce((sum, x) => sum + Math.max(0, x.limit - x.spent), 0);
          return {
            sessions: [session, ...s.sessions.map((x) => (replaced.includes(x) ? { ...x, status: 'revoked' as const } : x))],
            passes: withBalance(s.passes, pass.id, (b) => ({
              available: b.available + released - input.limit,
              held: Math.max(0, b.held - released) + input.limit,
            })),
            securityLog: logged('session-created', input.task, s.securityLog),
          };
        });
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

      reset: () => set((s) => ({ ...initial(), mainWallets: provision({}, s.context) })),
    }),
    // v4: the Main Wallet is the connected account (one balance per network) and passes belong to it; older saved data is dropped for the new seed.
    // The wallet context follows MetaMask on every load, so it is not saved.
    { name: 'signet-passport-mock', version: 5, partialize: ({ context: _context, ...saved }) => saved }
  )
);
