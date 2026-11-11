import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_NETWORK, NETWORKS } from '@/constant';
import { usePassportStore } from '@/stores/passport-store';

beforeEach(() => usePassportStore.getState().reset());

describe('networks config', () => {
  it('defaults to QDay/USD8 and keeps Base/USDC disabled', () => {
    expect(DEFAULT_NETWORK).toBe('qday');
    expect(NETWORKS.qday).toMatchObject({ enabled: true, token: { symbol: 'USD8' } });
    expect(NETWORKS.base).toMatchObject({ enabled: false, token: { symbol: 'USDC' } });
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

  it('funding moves USD8 from the main wallet to the SignetPass balance', () => {
    const { mainWallet, balance } = usePassportStore.getState();
    usePassportStore.getState().fundFromMain(40);
    const next = usePassportStore.getState();
    expect(next.mainWallet.balance).toBe(mainWallet.balance - 40);
    expect(next.balance.available).toBe(balance.available + 40);
    expect(next.deposits[0]).toMatchObject({ method: 'wallet', amount: 40 });
  });

  it('creates the SignetPass once and approves then revokes an agent', () => {
    expect(usePassportStore.getState().signetPass.created).toBe(false);
    usePassportStore.getState().createSignetPass();
    expect(usePassportStore.getState().signetPass.created).toBe(true);

    usePassportStore.getState().approveAgent('agt_pending');
    expect(usePassportStore.getState().agents.find((a) => a.id === 'agt_pending')?.status).toBe('active');
    usePassportStore.getState().revokeAgent('agt_pending');
    expect(usePassportStore.getState().agents.find((a) => a.id === 'agt_pending')?.status).toBe('revoked');
  });
});
