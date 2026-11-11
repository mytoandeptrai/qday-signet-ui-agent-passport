import { useGetActivityList } from '@/apis/activity';
import { useGetSession, useRevokeSessionMutation } from '@/apis/sessions';
import { useTranslation } from '@/integrations/i18n';
import { getRouteApi } from '@tanstack/react-router';
import { toast } from 'sonner';

const route = getRouteApi('/(app)/sessions/$sessionId');

export const useSessionDetailContainer = () => {
  const { t } = useTranslation('session-detail-page');
  const { sessionId } = route.useParams();
  const { data: session } = useGetSession(sessionId);
  const { data: activity = [] } = useGetActivityList();
  const revokeSession = useRevokeSessionMutation();

  const onRevoke = async () => {
    await revokeSession.mutateAsync({ id: sessionId });
    toast.success(t('toasts.revoked'));
  };

  return {
    session,
    activity: activity.filter((a) => a.sessionId === sessionId),
    refund: session ? session.limit - session.spent : 0,
    onRevoke,
  };
};
