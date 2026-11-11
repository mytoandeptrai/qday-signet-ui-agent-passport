import { useGetProfile } from '@/apis/account';
import { useCreateSignetPassMutation } from '@/apis/signetpass';
import { DEFAULT_NETWORK, NETWORKS } from '@/constant';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { useSignAction, useWallet } from '@/integrations/wallet';
import { toast } from 'sonner';

export const useCreateSignetPassContainer = () => {
  const { t } = useTranslation('signetpass-page');
  const { close } = useAppDialog();
  const { address } = useWallet();
  const { data: user } = useGetProfile();
  const createSignetPass = useCreateSignetPassMutation();
  const { status, run } = useSignAction();

  const onCreate = async () => {
    const ok = await run({ kind: 'create-signetpass', summary: 'Create SignetPass' }, () => createSignetPass.mutateAsync());
    if (!ok) return;
    toast.success(t('create.toasts.created'));
    close();
  };

  return {
    t,
    owner: address,
    signetPassAddress: user?.walletAddress,
    network: NETWORKS[DEFAULT_NETWORK],
    status,
    isLoading: status === 'waiting' || createSignetPass.isPending,
    onCreate,
  };
};
