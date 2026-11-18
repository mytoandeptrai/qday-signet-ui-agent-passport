import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KEYS } from './keys';
import { activateSignetPass, createSignetPass, fundFromMain, getInstallCode, getSignetPass, getSignetPasses, renameSignetPass, selectSignetPass } from './requests';

export const useGetSignetPasses = () =>
  useQuery({
    queryKey: [KEYS.SIGNETPASSES],
    queryFn: getSignetPasses,
    select: ({ passes, selectedId }) => ({ passes, selected: passes.find((p) => p.id === selectedId) ?? null }),
  });

export const useGetSignetPass = (id: string) => useQuery({ queryKey: [KEYS.SIGNETPASSES, id], queryFn: () => getSignetPass(id) });

const useRefreshAll = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries();
};

export const useCreateSignetPassMutation = () =>
  useMutation({ mutationKey: [KEYS.CREATE], mutationFn: createSignetPass, onSuccess: useRefreshAll() });

export const useActivateSignetPassMutation = () =>
  useMutation({ mutationKey: [KEYS.ACTIVATE], mutationFn: activateSignetPass, onSuccess: useRefreshAll() });

export const useRenameSignetPassMutation = () =>
  useMutation({ mutationKey: [KEYS.RENAME], mutationFn: renameSignetPass, onSuccess: useRefreshAll() });

export const useSelectSignetPassMutation = () =>
  useMutation({ mutationKey: [KEYS.SELECT], mutationFn: selectSignetPass, onSuccess: useRefreshAll() });

export const useFundFromMainMutation = () =>
  useMutation({ mutationKey: [KEYS.FUND], mutationFn: fundFromMain, onSuccess: useRefreshAll() });

export const useGetInstallCodeMutation = () => useMutation({ mutationKey: [KEYS.INSTALL_CODE], mutationFn: getInstallCode });
