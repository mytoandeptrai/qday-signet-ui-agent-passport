import { mockWalletAdapter } from './mock-wallet-adapter';
import type { WalletAdapter } from './types';

/** The single swap point: point this at a wagmi/viem adapter when the real MetaMask integration lands. */
export const walletAdapter: WalletAdapter = mockWalletAdapter;
