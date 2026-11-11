import { useGetSessionList, useRevokeSessionMutation } from '@/apis/sessions';
import { useTranslation } from '@/integrations/i18n';
import { useState } from 'react';
import { toast } from 'sonner';
import { VISIBLE_SESSIONS } from '../utils';

export const useOverviewSessionsContainer = () => {
  const { t } = useTranslation('overview-page');
  const { data: sessions = [] } = useGetSessionList();
  const revokeSession = useRevokeSessionMutation();
  const [revokeId, setRevokeId] = useState<string | null>(null);

  const target = sessions.find((s) => s.id === revokeId);

  const onRevoke = (id: string) => setRevokeId(id);
  const onCloseRevoke = () => setRevokeId(null);
  const onConfirmRevoke = async () => {
    if (!target) return;
    await revokeSession.mutateAsync({ id: target.id });
    toast.success(t('toasts.session-revoked'));
  };

  return { sessions: sessions.slice(0, VISIBLE_SESSIONS), target, onRevoke, onCloseRevoke, onConfirmRevoke };
};
