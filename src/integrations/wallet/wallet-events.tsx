import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useAccount, useAccountEffect } from 'wagmi';
import { DEFAULT_NETWORK, getNetworkByChainId } from '@/constant';
import { usePassportStore } from '@/stores/passport-store';

/** Mounted once: records connect/disconnect in the security log (not the silent reconnect after a reload), and tells the store which account and network the app shows. */
export const WalletEvents = () => {
  const recordWalletEvent = usePassportStore((s) => s.recordWalletEvent);
  const setContext = usePassportStore((s) => s.setContext);
  const queryClient = useQueryClient();
  const { address, chainId, isConnected } = useAccount();
  const lastAddress = useRef('');
  const account = isConnected && address ? address.toLowerCase() : null;
  const network = (isConnected ? getNetworkByChainId(chainId)?.key : undefined) ?? DEFAULT_NETWORK;

  // Switching account or network in MetaMask changes the Main Wallet and its SignetPasses on every screen.
  useEffect(() => {
    setContext(account, network);
    queryClient.invalidateQueries();
  }, [account, network, setContext, queryClient]);

  useAccountEffect({
    onConnect: ({ address, isReconnected }) => {
      lastAddress.current = address;
      if (!isReconnected) recordWalletEvent('wallet-connected', address);
    },
    onDisconnect: () => recordWalletEvent('wallet-disconnected', lastAddress.current),
  });

  return null;
};
