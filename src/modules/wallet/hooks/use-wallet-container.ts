import { useGetSignetPasses } from '@/apis/signetpass';
import { useGetMainWallet } from '@/apis/wallet';
import { NETWORKS } from '@/constant';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { useActiveNetwork, useWallet } from '@/integrations/wallet';
import { money } from '@/lib/format';
import { useState } from 'react';

export type WalletTokenId = 'native' | 'stable';

export interface WalletToken {
  id: WalletTokenId;
  symbol: string;
  amount: string;
}

export const useWalletContainer = () => {
  const { t } = useTranslation('wallet-page');
  const { data: wallet, isLoading } = useGetMainWallet();
  const { data: passes } = useGetSignetPasses();
  const { open } = useAppDialog();
  const { address, isConnected } = useWallet();
  const { isUnsupported, switchingTo, switchNetwork } = useActiveNetwork();
  const [tokenId, setTokenId] = useState<WalletTokenId>('stable');
  const [hidden, setHidden] = useState(false);

  const network = NETWORKS[wallet?.network ?? 'base'];
  const tokens: WalletToken[] = [
    { id: 'stable', symbol: network.token.symbol, amount: money(wallet?.balance ?? 0) },
    { id: 'native', symbol: network.nativeSymbol, amount: '0.00' },
  ];
  const selected = tokens.find((token) => token.id === tokenId) ?? tokens[0];

  return {
    t,
    network,
    address,
    isConnected,
    isUnsupported,
    switchingTo,
    tokens,
    selected,
    hidden,
    transactions: wallet?.transactions ?? [],
    signetPasses: passes?.passes ?? [],
    isLoading,
    onSwitchNetwork: switchNetwork,
    onSelectToken: setTokenId,
    onToggleHidden: () => setHidden((h) => !h),
    onSend: () => open('send'),
    onReceive: () => open('receive'),
    onCreateSignetPass: () => open('create-signetpass'),
  };
};
