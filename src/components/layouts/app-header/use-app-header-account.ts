import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useGetProfile } from '@/apis/account';
import { ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { usePassportStore } from '@/stores/passport-store';

export const useAppHeaderAccount = () => {
  const { t } = useTranslation('layout');
  const navigate = useNavigate();
  const { data: user } = useGetProfile();

  const onNavigate = (to: string) => navigate({ to });

  const onSignOut = () => {
    usePassportStore.getState().signOut();
    toast(t('toasts.signed-out'));
    navigate({ to: ROUTES.HOME });
  };

  return { user, onNavigate, onSignOut };
};
