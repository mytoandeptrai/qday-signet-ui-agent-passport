import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KEYS } from './keys';
import { createSignetPass, fundFromMain, getSignetPass } from './requests';

export const useGetSignetPass = () => useQuery({ queryKey: [KEYS.SIGNETPASS], queryFn: getSignetPass });

// The demo store is one database, so a write can change any screen: refresh everything.
const useRefreshAll = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries();
};

export const useCreateSignetPassMutation = () =>
  useMutation({ mutationKey: [KEYS.CREATE], mutationFn: createSignetPass, onSuccess: useRefreshAll() });

export const useFundFromMainMutation = () =>
  useMutation({ mutationKey: [KEYS.FUND], mutationFn: fundFromMain, onSuccess: useRefreshAll() });
