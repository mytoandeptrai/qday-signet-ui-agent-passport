import { useGetEscalationList } from '@/apis/escalations';

export const usePendingEscalationsContainer = () => {
  const { data: escalations = [] } = useGetEscalationList();
  return { pending: escalations.filter((e) => e.status === 'pending') };
};
