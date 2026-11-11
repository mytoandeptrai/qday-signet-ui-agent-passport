import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KEYS } from './keys';
import { getMainWallet, sendFromMain } from './requests';

export const useGetMainWallet = () => useQuery({ queryKey: [KEYS.MAIN_WALLET], queryFn: getMainWallet });

export const useSendFromMainMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [KEYS.SEND],
    mutationFn: sendFromMain,
    onSuccess: () => queryClient.invalidateQueries(),
  });
};
