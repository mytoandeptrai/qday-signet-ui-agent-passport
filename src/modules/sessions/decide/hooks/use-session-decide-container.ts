import { useDecideEscalationMutation, useGetEscalationList } from '@/apis/escalations';
import { useTranslation } from '@/integrations/i18n';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

const route = getRouteApi('/(app)/agent-escalation/decide');

export const useSessionDecideContainer = () => {
  const { t } = useTranslation('session-decide-page');
  const { id } = route.useSearch();
  const navigate = useNavigate();
  const { data: escalations = [] } = useGetEscalationList();
  const decide = useDecideEscalationMutation();
  const escalation = escalations.find((e) => e.id === id);

  const onDecide = async (approve: boolean) => {
    await decide.mutateAsync({ id, approve });
    if (approve) toast.success(t('toasts.approved'));
    else toast(t('toasts.declined'));
    navigate({ to: '/overview' });
  };

  return { escalation, isDone: escalation ? escalation.status !== 'pending' : true, onApprove: () => onDecide(true), onDecline: () => onDecide(false) };
};
