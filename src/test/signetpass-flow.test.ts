import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_NETWORK, NETWORKS, PASS_FEE } from '@/constant';
import type { TFunction } from 'i18next';
import { getBalance } from '@/apis/account/requests';
import { getSessionList } from '@/apis/sessions/requests';
import { loginEcommerce } from '@/apis/shopping/requests';
import { getInstallCode } from '@/apis/signetpass/requests';
import { INSTALL_CODE_PLACEHOLDER, installCommand } from '@/mock/landing';
import { createSignetPassFormSchema } from '@/modules/signetpass/hooks/schema';
import { cartTotal, formatAtomic, pricedCart } from '@/modules/shopping/utils';
import { currentEcommerceAccount, currentMainWallet, selectedPass, usePassportStore, visibleOrders, visiblePasses } from '@/stores/passport-store';

const ALICE = '0xalice';
const BOB = '0xbob';
const store = usePassportStore.getState;

const createActive = (name: string) => {
  const pass = store().createSignetPass({ name });
  store().activateSignetPass(pass.id);
  return pass;
};

beforeEach(() => {
  store().reset();
  store().setContext(ALICE, 'base');
});

describe('networks config', () => {
  it('defaults to QDay/USD8 and supports Base/USDC', () => {
    expect(DEFAULT_NETWORK).toBe('qday');
    expect(NETWORKS.qday).toMatchObject({ enabled: true, token: { symbol: 'USD8' } });
    expect(NETWORKS.base).toMatchObject({ enabled: true, token: { symbol: 'USDC' } });
  });
});

describe('main wallet', () => {
  it('is seeded once per account and network', () => {
    expect(currentMainWallet(store())?.balance).toBe(1250);
    store().sendFromMain('0xabc', 100);
    store().setContext(ALICE, 'qday');
    expect(currentMainWallet(store())?.balance).toBe(1250);
    store().setContext(ALICE, 'base');
    expect(currentMainWallet(store())?.balance).toBe(1150);
    store().setContext(BOB, 'base');
    expect(currentMainWallet(store())?.balance).toBe(1250);
  });

  it('is empty while no account is connected', () => {
    store().setContext(null, 'base');
    expect(currentMainWallet(store())).toBeNull();
    expect(() => store().sendFromMain('0xabc', 1)).toThrow();
  });

  it('sending lowers the balance and logs a transfer in the network token', () => {
    store().sendFromMain('0xabc', 100);
    const wallet = currentMainWallet(store());
    expect(wallet?.balance).toBe(1150);
    expect(wallet?.transactions[0]).toMatchObject({ kind: 'send', amount: 100 });
    expect(store().securityLog[0]).toMatchObject({ type: 'transfer', detail: '-100 USDC → 0xabc' });
  });
});

describe('SignetPass', () => {
  it('is created inactive, paying the fee from the Main Wallet, on its network', () => {
    const pass = store().createSignetPass({ name: 'Shopping' });
    expect(pass).toMatchObject({ owner: ALICE, network: 'base', status: 'inactive' });
    expect(pass.address).toMatch(/^0x[0-9a-f]{40}$/);
    const wallet = currentMainWallet(store());
    expect(wallet?.balance).toBe(1250 - PASS_FEE);
    expect(wallet?.transactions[0]).toMatchObject({ kind: 'fee', counterparty: 'Shopping', amount: PASS_FEE });
  });

  it('is activated for free', () => {
    const pass = store().createSignetPass({ name: 'Shopping' });
    store().activateSignetPass(pass.id);
    expect(selectedPass(store())?.status).toBe('active');
    expect(currentMainWallet(store())?.balance).toBe(1250 - PASS_FEE);
    expect(store().securityLog[0].type).toBe('signetpass-activated');
    store().activateSignetPass(pass.id);
    expect(currentMainWallet(store())?.balance).toBe(1250 - PASS_FEE);
  });

  it('cannot be created without an account, or without enough balance for the fee', () => {
    store().sendFromMain('0xabc', 1250 - PASS_FEE + 1);
    expect(() => store().createSignetPass({ name: 'Shopping' })).toThrow();
    store().setContext(null, 'base');
    expect(() => store().createSignetPass({ name: 'Research' })).toThrow();
    expect(store().passes).toHaveLength(0);
  });

  it('belongs to one account and one network', () => {
    const a = store().createSignetPass({ name: 'Shopping' });
    store().setContext(ALICE, 'qday');
    expect(visiblePasses(store())).toHaveLength(0);
    const b = store().createSignetPass({ name: 'Research' });
    expect(visiblePasses(store()).map((p) => p.id)).toEqual([b.id]);
    store().selectPass(a.id);
    expect(selectedPass(store())?.id).toBe(b.id);

    store().setContext(BOB, 'qday');
    expect(visiblePasses(store())).toHaveLength(0);
    expect(selectedPass(store())).toBeNull();

    store().setContext(ALICE, 'base');
    expect(selectedPass(store())?.id).toBe(a.id);
  });

  it('selects each new pass and can be renamed', () => {
    const a = store().createSignetPass({ name: 'Shopping' });
    const b = store().createSignetPass({ name: 'Research' });
    expect(selectedPass(store())?.id).toBe(b.id);
    store().selectPass(a.id);
    expect(selectedPass(store())?.name).toBe('Shopping');
    store().renamePass(a.id, '  Travel ');
    expect(selectedPass(store())?.name).toBe('Travel');
  });

  it('is funded from the Main Wallet, which needs an active pass', () => {
    expect(() => store().fundFromMain(40)).toThrow();
    const pass = store().createSignetPass({ name: 'Shopping' });
    expect(() => store().fundFromMain(40)).toThrow();
    store().activateSignetPass(pass.id);
    const before = currentMainWallet(store())?.balance ?? 0;
    store().fundFromMain(40);
    expect(currentMainWallet(store())?.balance).toBe(before - 40);
    expect(selectedPass(store())?.balance.available).toBe(40);
    expect(store().deposits[0]).toMatchObject({ passId: pass.id, method: 'wallet', amount: 40 });
  });

  it('needs to be active to start a session', () => {
    store().createSignetPass({ name: 'Shopping' });
    const session = { task: 'Groceries', agent: 'Codex', limit: 20, perCallLimit: 5, durationHours: 1 };
    expect(() => store().createSession(session)).toThrow();
  });

  it('keeps balance and sessions apart per pass', async () => {
    const a = createActive('Shopping');
    store().fundFromMain(50);
    store().createSession({ task: 'Groceries', agent: 'Codex', limit: 20, perCallLimit: 5, durationHours: 1 });
    const b = createActive('Research');

    expect(await getBalance()).toMatchObject({ available: 0, held: 0 });
    expect(await getSessionList()).toHaveLength(0);

    store().selectPass(a.id);
    expect(await getBalance()).toMatchObject({ available: 30, held: 20 });
    expect(await getSessionList()).toHaveLength(1);

    store().revokeSession((await getSessionList())[0].id);
    store().selectPass(b.id);
    expect(selectedPass(store())?.balance.available).toBe(0);
    expect(store().passes.find((p) => p.id === a.id)?.balance).toMatchObject({ available: 50, held: 0 });
  });

  it('rejects a duplicate or empty name', () => {
    const schema = createSignetPassFormSchema(((key: string) => key) as unknown as TFunction, ['shopping']);
    expect(schema.safeParse({ name: 'Shopping' }).success).toBe(false);
    expect(schema.safeParse({ name: '  ' }).success).toBe(false);
    expect(schema.safeParse({ name: 'x'.repeat(33) }).success).toBe(false);
    expect(schema.safeParse({ name: 'Travel' }).success).toBe(true);
  });
});

describe('Shopping', () => {
  const earbuds = 'p-earbuds';
  const cartAmount = () => Number(formatAtomic(cartTotal(pricedCart(store().cart, 'base'))));
  const sessionOf = (limit: number, perCallLimit = limit, agent = 'Claude Code') => {
    store().loginEcommerce({ email: 'alex@shop.test', name: 'Alex', shippingAddress: '1 Test Street' });
    createActive('Shopping');
    store().fundFromMain(500);
    return store().createSession({ task: 'Shopping', agent, limit, perCallLimit, durationHours: 1 });
  };

  it('pays an order from the spending session of an agent', () => {
    const session = sessionOf(100);
    store().addToCart(earbuds);
    store().addToCart(earbuds);
    const amount = cartAmount();
    const order = store().placeOrder({ sessionId: session.id });
    expect(order).toMatchObject({ owner: ALICE, network: 'base', passId: session.passId, status: 'paid' });
    expect(store().sessions[0]).toMatchObject({ spent: amount, status: 'active' });
    expect(selectedPass(store())?.balance).toMatchObject({ available: 400, held: 100 - amount });
    expect(currentMainWallet(store())?.balance).toBe(1250 - PASS_FEE - 500);
    expect(store().activity[0]).toMatchObject({ sessionId: session.id, service: 'Shopping', amount, status: 'settled' });
    expect(store().cart).toEqual([]);
    expect(store().securityLog[0].type).toBe('shop-order');
  });

  it('ships to the name and address of the e-commerce login, and needs an address', () => {
    const session = sessionOf(100);
    store().addToCart(earbuds);
    expect(store().placeOrder({ sessionId: session.id }).shipTo).toBe('Alex · 1 Test Street');
    store().loginEcommerce({ email: 'noaddress@shop.test', name: 'Noaddress', shippingAddress: '' });
    store().addToCart(earbuds);
    expect(() => store().placeOrder({ sessionId: session.id })).toThrow('No shipping address');
    store().logoutEcommerce();
    expect(currentEcommerceAccount(store())).toBeNull();
    store().setContext(BOB, 'base');
    expect(currentEcommerceAccount(store())).toBeNull();
  });

  it('mocks the e-commerce login with a name and address from the email', async () => {
    await loginEcommerce({ email: 'jane.doe@shop.test', password: 'x' });
    expect(currentEcommerceAccount(store())).toMatchObject({ name: 'Jane Doe', shippingAddress: expect.stringContaining('Example Street') });
    await loginEcommerce({ email: 'noaddress@shop.test', password: 'x' });
    expect(currentEcommerceAccount(store())?.shippingAddress).toBe('');
  });

  it('refuses an empty cart and a session that cannot cover the order', () => {
    const small = sessionOf(10);
    expect(() => store().placeOrder({ sessionId: small.id })).toThrow();
    store().addToCart(earbuds);
    expect(() => store().placeOrder({ sessionId: small.id })).toThrow();
    expect(() => store().placeOrder({ sessionId: 'ses_missing' })).toThrow();
    const capped = store().createSession({ task: 'Capped', agent: 'Codex', limit: 100, perCallLimit: 10, durationHours: 1 });
    expect(() => store().placeOrder({ sessionId: capped.id })).toThrow();
    store().revokeSession(capped.id);
    expect(() => store().placeOrder({ sessionId: capped.id })).toThrow();
    expect(store().orders).toHaveLength(0);
  });

  it('lets a new session replace the active one of the same agent only', () => {
    const first = sessionOf(100);
    const other = store().createSession({ task: 'Other', agent: 'Codex', limit: 50, perCallLimit: 50, durationHours: 1 });
    store().addToCart(earbuds);
    store().placeOrder({ sessionId: first.id });
    const spent = store().sessions.find((x) => x.id === first.id)?.spent ?? 0;
    const next = store().createSession({ task: 'Next', agent: 'Claude Code', limit: 100, perCallLimit: 100, durationHours: 1 });
    const status = (id: string) => store().sessions.find((x) => x.id === id)?.status;
    expect([status(first.id), status(other.id), status(next.id)]).toEqual(['revoked', 'active', 'active']);
    expect(selectedPass(store())?.balance).toMatchObject({ available: 500 - 100 - 50 - 100 + (100 - spent), held: 50 + 100 });
    expect(() => store().placeOrder({ sessionId: first.id })).toThrow();
  });

  it('keeps orders per account and network, and moves them along', () => {
    const session = sessionOf(100);
    store().addToCart(earbuds);
    const order = store().placeOrder({ sessionId: session.id });
    store().setOrderStatus(order.id, 'shipped', 'delivered');
    expect(visibleOrders(store())[0].status).toBe('paid');
    store().setOrderStatus(order.id, 'paid', 'shipped');
    expect(visibleOrders(store())[0].status).toBe('shipped');
    store().setContext(BOB, 'base');
    expect(visibleOrders(store())).toHaveLength(0);
    store().setContext(ALICE, 'qday');
    expect(visibleOrders(store())).toHaveLength(0);
  });

  it('clears the cart and the visible orders only', () => {
    store().addToCart(earbuds);
    store().placeOrder({ sessionId: sessionOf(100).id });
    store().setContext(BOB, 'base');
    store().addToCart(earbuds);
    store().placeOrder({ sessionId: sessionOf(100).id });
    store().addToCart(earbuds);
    store().clearShop();
    expect(store().cart).toEqual([]);
    expect(visibleOrders(store())).toHaveLength(0);
    store().setContext(ALICE, 'base');
    expect(visibleOrders(store())).toHaveLength(1);
  });
});

describe('install code', () => {
  it('goes into the macOS/Linux and Windows commands', () => {
    expect(installCommand('ABC', false)).toBe('curl -fsSL https://cli.qday.info/install.sh | sh -s -- ABC');
    expect(installCommand(INSTALL_CODE_PLACEHOLDER, true)).toBe("$env:QDAY_CODE='<INSTALL_CODE>'; irm https://cli.qday.info/install.ps1 | iex");
  });

  it('is only issued for an active SignetPass', async () => {
    const pass = store().createSignetPass({ name: 'Shopping' });
    await expect(getInstallCode({ passId: pass.id })).rejects.toThrow('not active');
    store().activateSignetPass(pass.id);
    await expect(getInstallCode({ passId: pass.id })).resolves.toEqual({ code: expect.stringMatching(/^SGN-/) });
  });
});

describe('agents (mock)', () => {
  it('lists registered and pending agents for a pass once it is activated', () => {
    const pass = createActive('Shopping');
    expect(store().agents.filter((a) => a.passId === pass.id).map((a) => [a.name, a.status])).toEqual([
      ['Claude Code', 'active'],
      ['Codex', 'active'],
      ['Cursor', 'pending'],
    ]);
  });
});
