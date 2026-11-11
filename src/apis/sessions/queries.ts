import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KEYS } from './keys';
import { createSession, getSession, getSessionList, revokeSession } from './requests';

export const useGetSessionList = () => useQuery({ queryKey: [KEYS.SESSIONS], queryFn: getSessionList });

export const useGetSession = (id: string) =>
  useQuery({ queryKey: [KEYS.SESSIONS, id], queryFn: () => getSession(id) });

export const useCreateSessionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [KEYS.SESSION_CREATE],
    mutationFn: createSession,
    onSuccess: () => queryClient.invalidateQueries(),
  });
};

export const useRevokeSessionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [KEYS.SESSION_REVOKE],
    mutationFn: revokeSession,
    onSuccess: () => queryClient.invalidateQueries(),
  });
};
