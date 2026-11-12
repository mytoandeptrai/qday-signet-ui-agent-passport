import { useApproveAgentMutation, useGetAgentList } from '@/apis/agents';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { useSignAction } from '@/integrations/wallet';
import { toast } from 'sonner';

export const useApproveAgentContainer = () => {
  const { t } = useTranslation('agents-page');
  const { params, close } = useAppDialog();
  const { data: agents = [] } = useGetAgentList();
  const approve = useApproveAgentMutation();
  const { status, summary, run } = useSignAction();
  const agent = agents.find((a) => a.id === params.id && a.status === 'pending');

  const onApprove = async () => {
    if (!agent) return;
    const ok = await run({ kind: 'approve-agent', summary: `Register agent ${agent.name}` }, () => approve.mutateAsync({ id: agent.id }));
    if (!ok) return;
    toast.success(t('approve.toasts.approved', { agent: agent.name }));
    close();
  };

  return { t, agent, status, summary, isLoading: status === 'waiting' || approve.isPending, onApprove, onCancel: close };
};
