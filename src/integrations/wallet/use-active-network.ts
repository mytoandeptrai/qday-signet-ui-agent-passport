import { toast } from 'sonner';
import { useAccount, useSwitchChain } from 'wagmi';
import { DEFAULT_NETWORK, getNetworkByChainId, NETWORKS, type NetworkKey } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { isUserRejectedError } from '@/utils/common';

/** The network the wallet is on, falling back to the default while disconnected. */
export const useActiveNetwork = () => {
  const { t } = useTranslation('wallet');
  const { chainId, isConnected } = useAccount();
  const { switchChainAsync, isPending, variables } = useSwitchChain();
  const current = isConnected ? getNetworkByChainId(chainId) : undefined;

  const switchNetwork = async (key: NetworkKey) => {
    try {
      await switchChainAsync({ chainId: NETWORKS[key].chainId });
    } catch (error) {
      toast.error(t(isUserRejectedError(error) ? 'network.switch-rejected' : 'network.switch-error'));
    }
  };

  return {
    network: current ?? NETWORKS[DEFAULT_NETWORK],
    isUnsupported: isConnected && !current,
    switchingTo: isPending ? variables?.chainId : undefined,
    switchNetwork,
  };
};
