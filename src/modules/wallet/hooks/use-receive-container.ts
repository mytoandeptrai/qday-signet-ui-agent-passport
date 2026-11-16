import { useGetMainWallet } from '@/apis/wallet';
import { NETWORKS } from '@/constant';
import { useAddressQr } from '@/hooks/use-address-qr';
import { useTranslation } from '@/integrations/i18n';
import { useWallet } from '@/integrations/wallet';

export const useReceiveContainer = () => {
  const { t } = useTranslation('wallet-page');
  const { address } = useWallet();
  const { data: wallet } = useGetMainWallet();
  const { data: qr } = useAddressQr(address);

  return { t, address, qr, network: NETWORKS[wallet?.network ?? 'base'] };
};
