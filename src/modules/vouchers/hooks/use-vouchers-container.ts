import { useGetVoucherList, useRedeemVoucherMutation } from '@/apis/vouchers';
import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { initialVoucherFormData, type VoucherFormData, voucherFormSchema } from './schema';

export const useVouchersContainer = () => {
  const { t } = useTranslation('vouchers-page');
  const { data: vouchers = [] } = useGetVoucherList();
  const redeemVoucher = useRedeemVoucherMutation();

  const form = useForm<VoucherFormData>({
    resolver: zodResolver(voucherFormSchema(t)),
    defaultValues: initialVoucherFormData,
  });

  const redeem = async (code: string) => {
    const result = await redeemVoucher.mutateAsync({ code });
    if (!result.ok) {
      form.setError('code', { message: result.error });
      return;
    }
    form.reset(initialVoucherFormData);
    toast.success(t('toasts.added', { amount: money(result.amount) }));
  };

  const onSubmit = ({ code }: VoucherFormData) => redeem(code);
  const onRedeemListed = (code: string) => redeem(code);

  return { t, form, vouchers, isLoading: redeemVoucher.isPending, onSubmit, onRedeemListed };
};
