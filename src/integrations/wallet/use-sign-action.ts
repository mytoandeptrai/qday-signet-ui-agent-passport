import { useState } from 'react';
import { usePassportStore } from '@/stores/passport-store';
import { type SignRequest, type SignStatus, WalletNotConnectedError, WalletRejectedError } from './types';
import { walletAdapter } from './wallet-adapter';

/** Wraps a MetaMask signature in idle → waiting → success | rejected | error. */
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

  /** Signs, then runs `action`. Resolves to whether both succeeded; failures are reflected in `status`. */
  const run = async (request: SignRequest, action: () => Promise<unknown>) => {
    try {
      await sign(request);
      await action();
      return true;
    } catch {
      setStatus((current) => (current === 'rejected' || current === 'error' ? current : 'error'));
      return false;
    }
  };

  const reset = () => setStatus('idle');

  return { status, sign, run, reset };
};
