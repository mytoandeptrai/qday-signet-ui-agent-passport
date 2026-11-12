import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_NETWORK, NETWORKS } from '@/constant';
import type { TFunction } from 'i18next';
import { getBalance } from '@/apis/account/requests';
import { getSessionList } from '@/apis/sessions/requests';
import { createSignetPassFormSchema } from '@/modules/signetpass/hooks/schema';
import { selectedPass, usePassportStore } from '@/stores/passport-store';

beforeEach(() => usePassportStore.getState().reset());

describe('networks config', () => {
  it('defaults to QDay/USD8 and supports Base/USDC', () => {
    expect(DEFAULT_NETWORK).toBe('qday');
    expect(NETWORKS.qday).toMatchObject({ enabled: true, token: { symbol: 'USD8' } });
    expect(NETWORKS.base).toMatchObject({ enabled: true, token: { symbol: 'USDC' } });
  });
});

describe('main wallet and SignetPass store', () => {
  it('sending from the main wallet lowers the balance and logs a transfer', () => {
    const before = usePassportStore.getState().mainWallet.balance;
    usePassportStore.getState().sendFromMain('0xabc', 100);
    const { mainWallet, securityLog } = usePassportStore.getState();
    expect(mainWallet.balance).toBe(before - 100);
    expect(mainWallet.transactions[0]).toMatchObject({ kind: 'send', amount: 100 });
    expect(securityLog[0].type).toBe('transfer');
  });

  it('funding needs a SignetPass and moves USD8 into the selected one', () => {
    const store = usePassportStore.getState;
    expect(() => store().fundFromMain(40)).toThrow();
    const pass = store().createSignetPass({ name: 'Shopping', network: 'base' });
    const before = store().mainWallet.balance;
    store().fundFromMain(40);
    expect(store().mainWallet.balance).toBe(before - 40);
    expect(selectedPass(store())?.balance.available).toBe(40);
    expect(store().deposits[0]).toMatchObject({ passId: pass.id, method: 'wallet', amount: 40 });
  });
});

describe('multiple SignetPasses', () => {
  it('starts empty and selects each new pass', () => {
    const store = usePassportStore.getState;
    expect(store().passes).toHaveLength(0);
    const a = store().createSignetPass({ name: 'Shopping', network: 'base' });
    const b = store().createSignetPass({ name: 'Research', network: 'qday' });
    expect(store().passes).toHaveLength(2);
    expect(a.address).toMatch(/^0x[0-9a-f]{40}$/);
    expect(a.address).not.toBe(b.address);
    expect(store().selectedPassId).toBe(b.id);
    store().selectPass(a.id);
    expect(selectedPass(store())?.name).toBe('Shopping');
  });

  it('keeps balance and sessions apart per pass', async () => {
    const store = usePassportStore.getState;
    const a = store().createSignetPass({ name: 'Shopping', network: 'base' });
    store().fundFromMain(50);
    store().createSession({ task: 'Groceries', agent: 'Codex', limit: 20, perCallLimit: 5, durationHours: 1 });
    const b = store().createSignetPass({ name: 'Research', network: 'qday' });

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
    expect(schema.safeParse({ name: 'Shopping', network: 'base' }).success).toBe(false);
    expect(schema.safeParse({ name: '  ', network: 'base' }).success).toBe(false);
    expect(schema.safeParse({ name: 'x'.repeat(33), network: 'base' }).success).toBe(false);
    expect(schema.safeParse({ name: 'Travel', network: 'qday' }).success).toBe(true);
  });
});
