import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KEYS } from './keys';
import { createDeposit, getDepositList } from './requests';

export const useGetDepositList = () => useQuery({ queryKey: [KEYS.DEPOSITS], queryFn: getDepositList });

export const useCreateDepositMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [KEYS.DEPOSITS],
    mutationFn: createDeposit,
    onSuccess: () => queryClient.invalidateQueries(),
  });
};
