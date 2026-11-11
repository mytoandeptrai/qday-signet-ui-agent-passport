import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KEYS } from './keys';
import { getVoucherList, redeemVoucher } from './requests';

export const useGetVoucherList = () => useQuery({ queryKey: [KEYS.VOUCHERS], queryFn: getVoucherList });

export const useRedeemVoucherMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [KEYS.VOUCHER_REDEEM],
    mutationFn: redeemVoucher,
    onSuccess: () => queryClient.invalidateQueries(),
  });
};
