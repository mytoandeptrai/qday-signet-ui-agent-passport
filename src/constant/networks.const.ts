import { baseSepolia } from 'viem/chains';

export type NetworkKey = 'qday' | 'base';

export interface NetworkConfig {
  key: NetworkKey;
  name: string;
  chainId: number;
  rpcUrl?: string;
  explorerUrl?: string;
  token: { symbol: string; decimals: number };
  /** Disabled networks render greyed out with a "coming soon" label. */
  enabled: boolean;
}

// QDay is not a known chain, so it comes from env. Base is built into viem/wagmi, so it needs no env.
// The QDay chain id and USD8 decimals are placeholders until the testnet details are confirmed.
export const NETWORKS: Record<NetworkKey, NetworkConfig> = {
  qday: {
    key: 'qday',
    name: 'QDay',
    chainId: Number(import.meta.env.VITE_QDAY_CHAIN_ID ?? 0),
    rpcUrl: import.meta.env.VITE_QDAY_RPC_URL,
    explorerUrl: import.meta.env.VITE_QDAY_EXPLORER_URL,
    token: { symbol: 'USD8', decimals: 8 },
    enabled: true,
  },
  base: {
    key: 'base',
    name: 'Base',
    chainId: baseSepolia.id,
    rpcUrl: baseSepolia.rpcUrls.default.http[0],
    explorerUrl: baseSepolia.blockExplorers.default.url,
    token: { symbol: 'USDC', decimals: 6 },
    enabled: false,
  },
};

export const DEFAULT_NETWORK: NetworkKey = (import.meta.env.VITE_DEFAULT_NETWORK as NetworkKey | undefined) ?? 'qday';
