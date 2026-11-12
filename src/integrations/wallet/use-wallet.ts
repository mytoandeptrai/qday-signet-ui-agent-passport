import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';

export type ConnectStatus = 'idle' | 'connecting' | 'reconnecting';

export const useWallet = () => {
  const { address, chainId, isConnected, isConnecting, isReconnecting } = useAccount();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const { disconnectAsync } = useDisconnect();

  const status: ConnectStatus = isConnecting ? 'connecting' : isReconnecting ? 'reconnecting' : 'idle';

  return {
    address,
    chainId,
    isConnected,
    status,
    isConnectModalOpen: connectModalOpen,
    connect: () => openConnectModal?.(),
    disconnect: async () => {
      await disconnectAsync();
    },
  };
};
