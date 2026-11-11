import { DEFAULT_NETWORK, NETWORKS } from '@/constant';
import { mockDelay } from '@/lib/mock-delay';
import { type WalletAdapter, WalletRejectedError } from './types';

const MOCK_ADDRESS = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';

/** Flip `rejectNext` (e.g. from the console or a test) to exercise the MetaMask rejection path. */
export const mockWalletControl = { rejectNext: false };

const maybeReject = () => {
  if (!mockWalletControl.rejectNext) return;
  mockWalletControl.rejectNext = false;
  throw new WalletRejectedError();
};

export const mockWalletAdapter: WalletAdapter = {
  connect: async () => {
    await mockDelay();
    maybeReject();
    return { address: MOCK_ADDRESS, chainId: NETWORKS[DEFAULT_NETWORK].chainId };
  },
  disconnect: async () => undefined,
  sign: async () => {
    await mockDelay();
    maybeReject();
    return { signature: `0x${Math.random().toString(16).slice(2).padEnd(130, '0')}` };
  },
};
