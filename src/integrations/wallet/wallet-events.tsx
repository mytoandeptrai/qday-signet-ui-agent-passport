import { useRef } from 'react';
import { useAccountEffect } from 'wagmi';
import { usePassportStore } from '@/stores/passport-store';

/** Mounted once: records connect/disconnect in the security log (not the silent reconnect after a reload). */
export const WalletEvents = () => {
  const recordWalletEvent = usePassportStore((s) => s.recordWalletEvent);
  const lastAddress = useRef('');

  useAccountEffect({
    onConnect: ({ address, isReconnected }) => {
      lastAddress.current = address;
      if (!isReconnected) recordWalletEvent('wallet-connected', address);
    },
    onDisconnect: () => recordWalletEvent('wallet-disconnected', lastAddress.current),
  });

  return null;
};
