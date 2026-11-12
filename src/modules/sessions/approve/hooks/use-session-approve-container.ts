import { useGetBalance } from '@/apis/account';
import { useCreateSessionMutation } from '@/apis/sessions';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { useSignAction } from '@/integrations/wallet';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { APPROVE_DEFAULTS } from './schema';

export const useSessionApproveContainer = () => {
  const { t } = useTranslation('session-approve-page');
  const { params, close } = useAppDialog();
  const navigate = useNavigate();
  const { data: balance } = useGetBalance();
  const createSession = useCreateSessionMutation();
  const { status, summary, run } = useSignAction();
  const available = balance?.available ?? 0;

  const request = {
    task: params.task ?? APPROVE_DEFAULTS.task,
    agent: params.agent ?? APPROVE_DEFAULTS.agent,
    limit: params.limit ?? APPROVE_DEFAULTS.limit,
    perCall: params.perCall ?? APPROVE_DEFAULTS.perCall,
    hours: params.hours ?? APPROVE_DEFAULTS.hours,
  };

  const onApprove = async () => {
    let sessionId = '';
    const ok = await run({ kind: 'create-session', summary: `Approve session: ${request.task}` }, async () => {
      sessionId = (
        await createSession.mutateAsync({
          task: request.task,
          agent: request.agent,
          limit: request.limit,
          perCallLimit: Math.min(request.perCall, request.limit),
          durationHours: request.hours,
        })
      ).id;
    });
    if (!ok) return;
    toast.success(t('toasts.approved'));
    navigate({ to: '/sessions/$sessionId', params: { sessionId } });
  };

  const onDecline = () => {
    toast(t('toasts.declined'));
    close();
  };

  return {
    request,
    available,
    isShort: request.limit > available,
    status,
    summary,
    isLoading: status === 'waiting' || createSession.isPending,
    onApprove,
    onDecline,
  };
};
