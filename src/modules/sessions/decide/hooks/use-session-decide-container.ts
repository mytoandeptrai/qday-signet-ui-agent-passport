import { useDecideEscalationMutation, useGetEscalationList } from '@/apis/escalations';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { useSignAction } from '@/integrations/wallet';
import { toast } from 'sonner';

export const useSessionDecideContainer = () => {
  const { t } = useTranslation('session-decide-page');
  const { params, close } = useAppDialog();
  const { data: escalations = [] } = useGetEscalationList();
  const decide = useDecideEscalationMutation();
  const { status, summary, run } = useSignAction();
  const escalation = escalations.find((e) => e.id === params.id);

  const onDecide = async (approve: boolean) => {
    if (!escalation) return;
    const action = () => decide.mutateAsync({ id: escalation.id, approve });
    // Approving moves money, so it needs a MetaMask signature; declining does not.
    const ok = approve ? await run({ kind: 'approve-agent', summary: `Approve ${escalation.amount} for ${escalation.agent}` }, action) : (await action(), true);
    if (!ok) return;
    if (approve) toast.success(t('toasts.approved'));
    else toast(t('toasts.declined'));
    close();
  };

  return {
    escalation,
    isDone: escalation ? escalation.status !== 'pending' : true,
    status,
    summary,
    isLoading: status === 'waiting' || decide.isPending,
    onApprove: () => onDecide(true),
    onDecline: () => onDecide(false),
  };
};
