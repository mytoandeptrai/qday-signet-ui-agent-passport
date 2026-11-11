import { useAddPasskeyMutation, useGetProfile, useRemovePasskeyMutation } from '@/apis/account';
import { useTranslation } from '@/integrations/i18n';
import { toast } from 'sonner';

export const useSettingsSecurityContainer = () => {
  const { t } = useTranslation('settings-page');
  const { data: user } = useGetProfile();
  const addPasskey = useAddPasskeyMutation();
  const removePasskey = useRemovePasskeyMutation();
  const passkeys = user?.passkeys ?? [];

  const onAddPasskey = async () => {
    await addPasskey.mutateAsync({ label: t('security.device', { number: passkeys.length + 1 }) });
    toast.success(t('toasts.passkey-added'));
  };

  const onRemovePasskey = async (id: string) => {
    await removePasskey.mutateAsync({ id });
    toast(t('toasts.passkey-removed'));
  };

  return { passkeys, canRemove: passkeys.length > 1, onAddPasskey, onRemovePasskey };
};
