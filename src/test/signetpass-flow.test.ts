import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_NETWORK, NETWORKS, PASS_FEE } from '@/constant';
import type { TFunction } from 'i18next';
import { getBalance } from '@/apis/account/requests';
import { getSessionList } from '@/apis/sessions/requests';
import { createSignetPassFormSchema } from '@/modules/signetpass/hooks/schema';
import { currentMainWallet, selectedPass, usePassportStore, visiblePasses } from '@/stores/passport-store';

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
