import { useGetProfile } from '@/apis/account';
import { useCreateDepositMutation, type DepositMethod } from '@/apis/deposits';
import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type DepositFormData, depositFormSchema, initialDepositFormData } from './schema';

export const useDepositContainer = () => {
  const { t } = useTranslation('deposit-page');
  const { data: user } = useGetProfile();
  const createDeposit = useCreateDepositMutation();
  const [method, setMethod] = useState<DepositMethod>('card');

  const form = useForm<DepositFormData>({
    resolver: zodResolver(depositFormSchema(t)),
    defaultValues: initialDepositFormData,
    mode: 'onChange',
  });
  const amount = form.watch('amount');

  const onMethodChange = (next: string) => setMethod(next as DepositMethod);
  const onPickPreset = (value: number) => form.setValue('amount', value, { shouldValidate: true });

  const onSubmit = async ({ amount: value }: DepositFormData) => {
    await createDeposit.mutateAsync({ amount: value, method });
    toast.success(t('toasts.added', { amount: money(value) }));
  };

  const onCopyAddress = () => {
    navigator.clipboard?.writeText(user?.walletAddress ?? '').catch(() => undefined);
    toast.success(t('toasts.address-copied'));
  };

  return {
    t,
    method,
    form,
    amount: Number.isFinite(amount) ? amount : 0,
    walletAddress: user?.walletAddress,
    isLoading: createDeposit.isPending,
    onMethodChange,
    onPickPreset,
    onSubmit,
    onCopyAddress,
  };
};
