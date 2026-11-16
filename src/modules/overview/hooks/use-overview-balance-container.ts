import { useGetSettings } from '@/apis/account';
import { useGetMainWallet } from '@/apis/wallet';
import { NETWORKS } from '@/constant';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { useWallet } from '@/integrations/wallet';
import { toast } from 'sonner';

export const useOverviewBalanceContainer = () => {
  const { t } = useTranslation('overview-page');
  const { open } = useAppDialog();
  const { address } = useWallet();
  const { data: wallet } = useGetMainWallet();
  const { data: settings } = useGetSettings();

  const onCopyAddress = () => {
    navigator.clipboard?.writeText(address ?? '').catch(() => undefined);
    toast.success(t('toasts.address-copied'));
  };

  return {
    balance: wallet?.balance ?? 0,
    network: NETWORKS[wallet?.network ?? 'base'],
    address,
    passkeyEnabled: settings?.passkeyEnabled !== false,
    onCopyAddress,
    onAddFunds: () => open('add-funds'),
  };
};
