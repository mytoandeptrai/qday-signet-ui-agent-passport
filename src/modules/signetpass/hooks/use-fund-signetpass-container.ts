import { useGetSignetPasses } from '@/apis/signetpass';
import { NETWORKS } from '@/constant';
import { useAddressQr } from '@/hooks/use-address-qr';
import { useTranslation } from '@/integrations/i18n';
import { useState } from 'react';
import type { FundSignetpassTab } from './schema';

export const useFundSignetpassContainer = () => {
  const { t } = useTranslation('signetpass-page');
  const { data } = useGetSignetPasses();
  const pass = data?.selected;
  const { data: qr } = useAddressQr(pass?.address);
  const [tab, setTab] = useState<FundSignetpassTab>('main');

  return {
    t,
    tab,
    address: pass?.address,
    qr,
    network: NETWORKS[pass?.network ?? 'base'],
    onTabChange: (next: string) => setTab(next as FundSignetpassTab),
  };
};
