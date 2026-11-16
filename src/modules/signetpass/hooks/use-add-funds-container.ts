import { useGetMainWallet } from '@/apis/wallet';
import { NETWORKS } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { useWallet } from '@/integrations/wallet';
import { useState } from 'react';
import type { AddFundsTab } from './schema';

/** Adds funds to the Main Wallet: the connected MetaMask account, on the network it is on. */
export const useAddFundsContainer = () => {
  const { t } = useTranslation('signetpass-page');
  const { address } = useWallet();
  const { data: mainWallet } = useGetMainWallet();
  const [tab, setTab] = useState<AddFundsTab>('crypto');

  return {
    t,
    tab,
    address,
    network: NETWORKS[mainWallet?.network ?? 'base'],
    onTabChange: (next: string) => setTab(next as AddFundsTab),
  };
};
