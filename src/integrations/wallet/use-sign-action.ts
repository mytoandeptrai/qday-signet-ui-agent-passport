import { useState } from 'react';
import { usePassportStore } from '@/stores/passport-store';
import { walletAdapter } from './wallet-adapter';
import { type SignRequest, type SignStatus, WalletNotConnectedError, WalletRejectedError } from './types';

/** Wraps a MetaMask signature in idle → waiting → success | rejected | error. Callers await `sign` before mutating. */
export const useSignAction = () => {
  const [status, setStatus] = useState<SignStatus>('idle');

  const sign = async (request: SignRequest) => {
    if (!usePassportStore.getState().wallet) throw new WalletNotConnectedError();
    setStatus('waiting');
    try {
      const result = await walletAdapter.sign(request);
      setStatus('success');
      return result;
    } catch (error) {
      setStatus(error instanceof WalletRejectedError ? 'rejected' : 'error');
      throw error;
    }
  };

  const reset = () => setStatus('idle');

  return { status, sign, reset };
};
