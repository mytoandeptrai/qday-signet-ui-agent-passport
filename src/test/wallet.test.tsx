import { UserRejectedRequestError } from 'viem';
import { act, cleanup, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import WalletGate from '@/components/ui/wallet-gate';
import { NETWORKS } from '@/constant';
import { useSignAction, useWallet } from '@/integrations/wallet';
import { WalletNotConnectedError, WalletUnsupportedNetworkError } from '@/integrations/wallet/types';

const t = (key: string) => key;
vi.mock('@/integrations/i18n', () => ({ useTranslation: () => ({ t }) }));

const account = { address: undefined as string | undefined, chainId: undefined as number | undefined, isConnected: false };
const signMessageAsync = vi.fn();
const openConnectModal = vi.fn();
const switchChainAsync = vi.fn();

vi.mock('wagmi', () => ({
  useAccount: () => ({ ...account, isConnecting: false, isReconnecting: false }),
  useSignMessage: () => ({ signMessageAsync }),
  useDisconnect: () => ({ disconnectAsync: vi.fn() }),
  useSwitchChain: () => ({ switchChainAsync, isPending: false, variables: undefined }),
}));
vi.mock('@rainbow-me/rainbowkit', () => ({ useConnectModal: () => ({ openConnectModal }) }));

const connect = (chainId: number) => Object.assign(account, { address: '0xabc', chainId, isConnected: true });
const qdayChainId = NETWORKS.qday.chainId;

beforeEach(() => {
  Object.assign(account, { address: undefined, chainId: undefined, isConnected: false });
  signMessageAsync.mockReset();
  openConnectModal.mockReset();
});

afterEach(cleanup);

describe('wallet: connect and sign', () => {
  it('opens the RainbowKit connect modal and reflects the wagmi account', () => {
    const { result, rerender } = renderHook(() => useWallet());
    expect(result.current.isConnected).toBe(false);

    act(() => result.current.connect());
    expect(openConnectModal).toHaveBeenCalledOnce();

    connect(qdayChainId);
    rerender();
    expect(result.current).toMatchObject({ isConnected: true, address: '0xabc', chainId: qdayChainId });
  });

  it('refuses to sign without a connected wallet', async () => {
    const { result } = renderHook(() => useSignAction());
    await expect(result.current.sign({ kind: 'transfer', summary: 'x' })).rejects.toBeInstanceOf(WalletNotConnectedError);
    expect(signMessageAsync).not.toHaveBeenCalled();
  });

  it('refuses to sign on an unsupported network', async () => {
    connect(1);
    const { result } = renderHook(() => useSignAction());
    await expect(result.current.sign({ kind: 'transfer', summary: 'x' })).rejects.toBeInstanceOf(WalletUnsupportedNetworkError);
    expect(signMessageAsync).not.toHaveBeenCalled();
  });

  it('signs a readable message and moves waiting → success', async () => {
    connect(qdayChainId);
    let finish: (signature: string) => void = () => undefined;
    signMessageAsync.mockReturnValue(new Promise((resolve) => (finish = resolve)));
    const { result } = renderHook(() => useSignAction());

    let signing!: Promise<{ signature: string }>;
    act(() => {
      signing = result.current.sign({ kind: 'transfer', summary: 'Send 5 USD8' });
    });
    expect(result.current.status).toBe('waiting');
    expect(signMessageAsync.mock.calls[0][0].message).toContain('Send 5 USD8');

    await act(async () => {
      finish('0xsig');
      await signing;
    });
    expect(result.current.status).toBe('success');
    expect(await signing).toEqual({ signature: '0xsig' });
  });

  it('reports rejected when MetaMask declines and error for other failures', async () => {
    connect(qdayChainId);
    const { result } = renderHook(() => useSignAction());

    signMessageAsync.mockRejectedValueOnce(new UserRejectedRequestError(new Error('no')));
    await act(async () => {
      await result.current.run({ kind: 'transfer', summary: 'x' }, async () => undefined);
    });
    expect(result.current.status).toBe('rejected');

    signMessageAsync.mockRejectedValueOnce(new Error('locked'));
    await act(async () => {
      await result.current.run({ kind: 'transfer', summary: 'x' }, async () => undefined);
    });
    expect(result.current.status).toBe('error');
  });
});

describe('WalletGate', () => {
  it('shows a connect prompt, then a network prompt, then the children', () => {
    const { rerender } = render(<WalletGate>secret</WalletGate>);
    expect(screen.queryByText('secret')).toBeNull();
    expect(screen.getByText('gate.title')).toBeTruthy();

    connect(1);
    rerender(<WalletGate>secret</WalletGate>);
    expect(screen.queryByText('secret')).toBeNull();
    expect(screen.getByText('gate.unsupported-title')).toBeTruthy();

    connect(qdayChainId);
    rerender(<WalletGate>secret</WalletGate>);
    expect(screen.getByText('secret')).toBeTruthy();
  });
});
