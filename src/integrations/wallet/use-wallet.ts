import { useState } from 'react';
import { usePassportStore } from '@/stores/passport-store';
import { walletAdapter } from './wallet-adapter';
import { WalletRejectedError } from './types';

export type ConnectStatus = 'idle' | 'connecting' | 'rejected' | 'error';

export const useWallet = () => {
  const wallet = usePassportStore((s) => s.wallet);
  const setWallet = usePassportStore((s) => s.setWallet);
  const [status, setStatus] = useState<ConnectStatus>('idle');

  const connect = async () => {
    setStatus('connecting');
    try {
      setWallet(await walletAdapter.connect());
      setStatus('idle');
    } catch (error) {
      setStatus(error instanceof WalletRejectedError ? 'rejected' : 'error');
    }
  };

  const disconnect = async () => {
    await walletAdapter.disconnect();
    setWallet(null);
  };

  return {
    address: wallet?.address,
    chainId: wallet?.chainId,
    isConnected: !!wallet,
    status,
    connect,
    disconnect,
  };
};
