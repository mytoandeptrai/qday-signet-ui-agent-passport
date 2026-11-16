import { useGetBalance } from '@/apis/account';
import { useGetSignetPasses } from '@/apis/signetpass';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { toast } from 'sonner';

export const useOverviewBalanceContainer = () => {
  const { t } = useTranslation('overview-page');
  const { open } = useAppDialog();
  const { data: passes } = useGetSignetPasses();
  const pass = passes?.selected;
  const { data: balance } = useGetBalance();

  const onCopyAddress = () => {
    navigator.clipboard?.writeText(pass?.address ?? '').catch(() => undefined);
    toast.success(t('toasts.address-copied'));
  };

  return {
    available: balance?.available ?? 0,
    pass,
    onCopyAddress,
    onAddFunds: () => open('add-funds'),
  };
};
