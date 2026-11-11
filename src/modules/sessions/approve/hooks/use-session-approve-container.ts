import { useGetBalance } from '@/apis/account';
import { useCreateSessionMutation } from '@/apis/sessions';
import { useTranslation } from '@/integrations/i18n';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

const route = getRouteApi('/(app)/agent-session/approve');

export const useSessionApproveContainer = () => {
  const { t } = useTranslation('session-approve-page');
  const request = route.useSearch();
  const navigate = useNavigate();
  const { data: balance } = useGetBalance();
  const createSession = useCreateSessionMutation();
  const available = balance?.available ?? 0;

  const onApprove = async () => {
    const session = await createSession.mutateAsync({
      task: request.task,
      agent: request.agent,
      limit: request.limit,
      perCallLimit: Math.min(request.perCall, request.limit),
      durationHours: request.hours,
    });
    toast.success(t('toasts.approved'));
    navigate({ to: '/sessions/$sessionId', params: { sessionId: session.id } });
  };

  const onDecline = () => {
    toast(t('toasts.declined'));
    navigate({ to: '/overview' });
  };

  return { request, available, isShort: request.limit > available, onApprove, onDecline };
};
