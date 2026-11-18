import { useActivateSignetPassMutation, useGetSignetPasses } from '@/apis/signetpass';
import { NETWORKS } from '@/constant';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { toast } from 'sonner';

export const useActivateSignetPassContainer = () => {
  const { t } = useTranslation('signetpass-page');
  const { close } = useAppDialog();
  const { data } = useGetSignetPasses();
  const pass = data?.selected;
  const activate = useActivateSignetPassMutation();
  const network = NETWORKS[pass?.network ?? 'base'];

  const onActivate = async () => {
    if (!pass) return;
    await activate.mutateAsync({ id: pass.id });
    toast.success(t('activate.toasts.done', { name: pass.name }));
    close();
  };

  return {
    t,
    pass,
    network,
    isLoading: activate.isPending,
    onActivate,
  };
};
