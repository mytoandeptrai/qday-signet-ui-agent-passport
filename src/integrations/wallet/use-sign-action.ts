import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { getNetworkByChainId } from '@/constant';
import { usePassportStore } from '@/stores/passport-store';
import { isUserRejectedError } from '@/utils/common';
import { buildSignMessage } from './sign-message';
import { type SignRequest, type SignStatus, WalletNotConnectedError, WalletUnsupportedNetworkError } from './types';

export const useSignAction = () => {
  const [status, setStatus] = useState<SignStatus>('idle');
  const [summary, setSummary] = useState<string>();
  const { address, chainId, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const passkeyEnabled = usePassportStore((s) => s.settings.passkeyEnabled !== false);

  /**
   * A real signature with no transaction: nothing is written on-chain yet. When the contracts are live,
   * this is the one place to swap `signMessageAsync` for `writeContract`.
   */
  const sign = async (request: SignRequest) => {
    const network = getNetworkByChainId(chainId);
    if (!isConnected || !address || !chainId) throw new WalletNotConnectedError();
    if (!network) throw new WalletUnsupportedNetworkError();
    setSummary(request.summary);
    setStatus('waiting');
    try {
      const signature = await signMessageAsync({
        message: buildSignMessage(request, { address, chainId, chainName: network.name }),
      });
      setStatus('success');
      return { signature };
    } catch (error) {
      setStatus(isUserRejectedError(error) ? 'rejected' : 'error');
      throw error;
    }
  };

  /**
   * Signs, then runs `action`. Resolves to whether both succeeded; failures are reflected in `status`.
   * Passkey off is global: the signature step is skipped and `action` runs directly.
   */
  const run = async (request: SignRequest, action: () => Promise<unknown>) => {
    try {
      if (passkeyEnabled) await sign(request);
      await action();
      return true;
    } catch {
      setStatus((current) => (current === 'rejected' || current === 'error' ? current : 'error'));
      return false;
    }
  };

  const reset = () => {
    setStatus('idle');
    setSummary(undefined);
  };

  return { status, summary, sign, run, reset };
};
