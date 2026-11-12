import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useGetProfile } from '@/apis/account';
import { ROUTES } from '@/constant';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { useWallet } from '@/integrations/wallet';
import { usePassportStore } from '@/stores/passport-store';

export const useAppHeaderAccount = () => {
  const { t } = useTranslation('layout');
  const navigate = useNavigate();
  const { open } = useAppDialog();
  const { data: user } = useGetProfile();
  const { disconnect } = useWallet();

  const onNavigate = (to: string) => navigate({ to });

  const onSignOut = () => {
    usePassportStore.getState().signOut();
    void disconnect();
    toast(t('toasts.signed-out'));
    navigate({ to: ROUTES.HOME });
  };

  return { user, onNavigate, onAddFunds: () => open('add-funds'), onSignOut };
};
