import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KEYS } from './keys';
import { decideEscalation, getEscalationList } from './requests';

export const useGetEscalationList = () => useQuery({ queryKey: [KEYS.ESCALATIONS], queryFn: getEscalationList });

export const useDecideEscalationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [KEYS.ESCALATION_DECIDE],
    mutationFn: decideEscalation,
    onSuccess: () => queryClient.invalidateQueries(),
  });
};
