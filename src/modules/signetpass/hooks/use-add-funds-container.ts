import { useGetProfile } from '@/apis/account';
import { useFundFromMainMutation, useGetSignetPass } from '@/apis/signetpass';
import { useGetMainWallet } from '@/apis/wallet';
import { DEFAULT_NETWORK, NETWORKS } from '@/constant';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { useSignAction } from '@/integrations/wallet';
import { money } from '@/lib/format';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type AddFundsTab, initialTransferFormData, type TransferFormData, transferFormSchema } from './schema';

export const useAddFundsContainer = () => {
  const { t } = useTranslation('signetpass-page');
  const { open, close } = useAppDialog();
  const { data: user } = useGetProfile();
  const { data: signetPass } = useGetSignetPass();
  const { data: mainWallet } = useGetMainWallet();
  const fund = useFundFromMainMutation();
  const { status, run } = useSignAction();
  const [tab, setTab] = useState<AddFundsTab>('crypto');
  const mainBalance = mainWallet?.balance ?? 0;

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferFormSchema(t, mainBalance)),
    defaultValues: initialTransferFormData,
    mode: 'onChange',
  });
  const amount = form.watch('amount');

  const onSubmit = async (values: TransferFormData) => {
    const ok = await run({ kind: 'transfer', summary: `Transfer ${values.amount} USD8 to SignetPass` }, () => fund.mutateAsync(values));
    if (!ok) return;
    toast.success(t('add-funds.transfer.toasts.done', { amount: money(values.amount) }));
    close();
  };

  return {
    t,
    tab,
    created: signetPass?.created ?? false,
    address: user?.walletAddress,
    network: NETWORKS[DEFAULT_NETWORK],
    mainBalance,
    form,
    amount: Number.isFinite(amount) ? amount : 0,
    status,
    isLoading: status === 'waiting' || fund.isPending,
    onTabChange: (next: string) => setTab(next as AddFundsTab),
    onCreateSignetPass: () => open('create-signetpass'),
    onSubmit,
  };
};
