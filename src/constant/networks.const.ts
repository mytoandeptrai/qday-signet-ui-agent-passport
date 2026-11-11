export type NetworkKey = 'qday' | 'base';

export interface NetworkConfig {
  key: NetworkKey;
  name: string;
  chainId: number;
  token: { symbol: string; decimals: number };
  /** Disabled networks render greyed out with a "coming soon" label. */
  enabled: boolean;
}

// Chain ids and USD8 decimals are placeholders until the QDay testnet details are confirmed.
export const NETWORKS: Record<NetworkKey, NetworkConfig> = {
  qday: {
    key: 'qday',
    name: 'QDay',
    chainId: Number(import.meta.env.VITE_QDAY_CHAIN_ID ?? 0),
    token: { symbol: 'USD8', decimals: 8 },
    enabled: true,
  },
  base: {
    key: 'base',
    name: 'Base',
    chainId: 84532,
    token: { symbol: 'USDC', decimals: 6 },
    enabled: false,
  },
};

export const DEFAULT_NETWORK: NetworkKey = (import.meta.env.VITE_DEFAULT_NETWORK as NetworkKey | undefined) ?? 'qday';
