import { useGetMainWallet } from '@/apis/wallet';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';

export const useWalletContainer = () => {
  const { t } = useTranslation('wallet-page');
  const { data: wallet, isLoading } = useGetMainWallet();
  const { open } = useAppDialog();

  return {
    t,
    balance: wallet?.balance ?? 0,
    transactions: wallet?.transactions ?? [],
    isLoading,
    onSend: () => open('send'),
    onReceive: () => open('receive'),
  };
};
