import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KEYS } from './keys';
import { createSignetPass, fundFromMain, getSignetPasses, selectSignetPass } from './requests';

export const useGetSignetPasses = () =>
  useQuery({
    queryKey: [KEYS.SIGNETPASSES],
    queryFn: getSignetPasses,
    select: ({ passes, selectedId }) => ({ passes, selected: passes.find((p) => p.id === selectedId) ?? null }),
  });

// The demo store is one database, so a write can change any screen: refresh everything.
const useRefreshAll = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries();
};

export const useCreateSignetPassMutation = () =>
  useMutation({ mutationKey: [KEYS.CREATE], mutationFn: createSignetPass, onSuccess: useRefreshAll() });

// Every screen shows the selected pass, so switching refreshes them all.
export const useSelectSignetPassMutation = () =>
  useMutation({ mutationKey: [KEYS.SELECT], mutationFn: selectSignetPass, onSuccess: useRefreshAll() });

export const useFundFromMainMutation = () =>
  useMutation({ mutationKey: [KEYS.FUND], mutationFn: fundFromMain, onSuccess: useRefreshAll() });
