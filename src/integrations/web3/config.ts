import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { defineChain } from 'viem';
import { baseSepolia } from 'viem/chains';
import { http, type Config } from 'wagmi';
import { NETWORKS } from '@/constant';

const { qday } = NETWORKS;

export const qdayChain = defineChain({
  id: qday.chainId,
  name: qday.name,
  nativeCurrency: {
    name: import.meta.env.VITE_QDAY_NATIVE_CURRENCY_NAME || 'QDay',
    symbol: import.meta.env.VITE_QDAY_NATIVE_CURRENCY_SYMBOL || 'QDAY',
    decimals: Number(import.meta.env.VITE_QDAY_NATIVE_CURRENCY_DECIMALS || 18),
  },
  rpcUrls: { default: { http: [qday.rpcUrl ?? ''] } },
  blockExplorers: qday.explorerUrl ? { default: { name: qday.name, url: qday.explorerUrl } } : undefined,
  testnet: qday.testnet,
});

export const wagmiConfig: Config = getDefaultConfig({
  appName: 'Signet',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'signet-dev',
  chains: [qdayChain, baseSepolia],
  transports: {
    [qdayChain.id]: http(qday.rpcUrl),
    [baseSepolia.id]: http(),
  },
  wallets: [{ groupName: 'Popular', wallets: [metaMaskWallet] }],
  ssr: false,
});
