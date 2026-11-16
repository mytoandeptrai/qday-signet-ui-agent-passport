import { useQuery } from '@tanstack/react-query';
import QRCode from 'qrcode';
import { useGetMainWallet } from '@/apis/wallet';
import { NETWORKS } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { useWallet } from '@/integrations/wallet';

export const useReceiveContainer = () => {
  const { t } = useTranslation('wallet-page');
  const { address } = useWallet();
  const { data: wallet } = useGetMainWallet();
  const { data: qr } = useQuery({
    queryKey: ['wallet/receive-qr', address],
    queryFn: () => QRCode.toDataURL(address ?? '', { margin: 1, width: 192 }),
    enabled: !!address,
    staleTime: Infinity,
  });

  return { t, address, qr, network: NETWORKS[wallet?.network ?? 'base'] };
};
