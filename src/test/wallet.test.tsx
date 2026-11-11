import { act, cleanup, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import WalletGate from '@/components/ui/wallet-gate';
import { mockWalletControl, useSignAction, useWallet } from '@/integrations/wallet';
import { WalletNotConnectedError, WalletRejectedError } from '@/integrations/wallet/types';
import { usePassportStore } from '@/stores/passport-store';

const t = (key: string) => key;
vi.mock('@/integrations/i18n', () => ({ useTranslation: () => ({ t }) }));

beforeEach(() => {
  vi.useFakeTimers();
  usePassportStore.getState().setWallet(null);
  mockWalletControl.rejectNext = false;
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('wallet: connect and sign', () => {
  it('connects through the adapter and stores only the address and chain', async () => {
    const { result } = renderHook(() => useWallet());
    expect(result.current.isConnected).toBe(false);

    const pending = act(() => result.current.connect());
    await vi.runAllTimersAsync();
    await pending;

    expect(result.current.isConnected).toBe(true);
    expect(Object.keys(usePassportStore.getState().wallet ?? {}).sort()).toEqual(['address', 'chainId']);
  });

  it('reports a rejected connection without connecting', async () => {
    mockWalletControl.rejectNext = true;
    const { result } = renderHook(() => useWallet());

    const pending = act(() => result.current.connect());
    await vi.runAllTimersAsync();
    await pending;

    expect(result.current.status).toBe('rejected');
    expect(result.current.isConnected).toBe(false);
  });

  it('refuses to sign without a connected wallet', async () => {
    const { result } = renderHook(() => useSignAction());
    await expect(result.current.sign({ kind: 'transfer', summary: 'x' })).rejects.toBeInstanceOf(WalletNotConnectedError);
  });

  it('moves waiting → success, and waiting → rejected when MetaMask declines', async () => {
    usePassportStore.getState().setWallet({ address: '0xabc', chainId: 1 });
    const { result } = renderHook(() => useSignAction());

    let signing = result.current.sign({ kind: 'transfer', summary: 'x' });
    await act(async () => undefined);
    expect(result.current.status).toBe('waiting');
    await vi.runAllTimersAsync();
    await signing;
    await act(async () => undefined);
    expect(result.current.status).toBe('success');

    mockWalletControl.rejectNext = true;
    signing = result.current.sign({ kind: 'transfer', summary: 'x' });
    const outcome = signing.catch((error) => error);
    await vi.runAllTimersAsync();
    expect(await outcome).toBeInstanceOf(WalletRejectedError);
    await act(async () => undefined);
    expect(result.current.status).toBe('rejected');
  });
});

describe('WalletGate', () => {
  it('hides children and shows a connect prompt until a wallet is connected', () => {
    const { rerender } = render(<WalletGate>secret</WalletGate>);
    expect(screen.queryByText('secret')).toBeNull();
    expect(screen.getByText('gate.title')).toBeTruthy();

    act(() => usePassportStore.getState().setWallet({ address: '0xabc', chainId: 1 }));
    rerender(<WalletGate>secret</WalletGate>);
    expect(screen.getByText('secret')).toBeTruthy();
  });
});
