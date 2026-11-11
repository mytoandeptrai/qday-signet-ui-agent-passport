import { useGetSessionList, useRevokeSessionMutation } from '@/apis/sessions';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { useState } from 'react';
import { toast } from 'sonner';

export const useSessionsListContainer = () => {
  const { t } = useTranslation('sessions-page');
  const { open } = useAppDialog();
  const { data: sessions = [] } = useGetSessionList();
  const revoke = useRevokeSessionMutation();
  const [revokeId, setRevokeId] = useState<string>();
  const target = sessions.find((s) => s.id === revokeId);

  const onConfirmRevoke = async () => {
    if (!target) return;
    await revoke.mutateAsync({ id: target.id });
    toast.success(t('revoke.toast'));
    setRevokeId(undefined);
  };

  return {
    t,
    sessions,
    target,
    isRevoking: revoke.isPending,
    onNew: () => open('create-session'),
    onRevoke: setRevokeId,
    onCloseRevoke: () => setRevokeId(undefined),
    onConfirmRevoke,
  };
};
