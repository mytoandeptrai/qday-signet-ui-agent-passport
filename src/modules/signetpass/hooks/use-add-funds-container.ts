import { useGetMainWallet } from '@/apis/wallet';
import { NETWORKS } from '@/constant';
import { useAddressQr } from '@/hooks/use-address-qr';
import { useTranslation } from '@/integrations/i18n';
import { useWallet } from '@/integrations/wallet';
import { useState } from 'react';
import type { AddFundsTab } from './schema';

export const useAddFundsContainer = () => {
  const { t } = useTranslation('signetpass-page');
  const { address } = useWallet();
  const { data: mainWallet } = useGetMainWallet();
  const { data: qr } = useAddressQr(address);
  const [tab, setTab] = useState<AddFundsTab>('crypto');

  return {
    t,
    tab,
    address,
    qr,
    network: NETWORKS[mainWallet?.network ?? 'base'],
    onTabChange: (next: string) => setTab(next as AddFundsTab),
  };
};
