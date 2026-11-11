import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KEYS } from './keys';
import { approveAgent, getAgentList, getSecurityLog, revokeAgent } from './requests';

export const useGetAgentList = () => useQuery({ queryKey: [KEYS.AGENTS], queryFn: getAgentList });
export const useGetSecurityLog = () => useQuery({ queryKey: [KEYS.SECURITY_LOG], queryFn: getSecurityLog });

const useRefreshAll = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries();
};

export const useApproveAgentMutation = () =>
  useMutation({ mutationKey: [KEYS.APPROVE], mutationFn: approveAgent, onSuccess: useRefreshAll() });

export const useRevokeAgentMutation = () =>
  useMutation({ mutationKey: [KEYS.REVOKE], mutationFn: revokeAgent, onSuccess: useRefreshAll() });
