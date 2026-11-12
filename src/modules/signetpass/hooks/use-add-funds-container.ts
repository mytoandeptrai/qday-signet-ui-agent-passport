import { useFundFromMainMutation, useGetSignetPasses } from '@/apis/signetpass';
import { useGetMainWallet } from '@/apis/wallet';
import { NETWORKS } from '@/constant';
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
  const { data } = useGetSignetPasses();
  const pass = data?.selected;
  const { data: mainWallet } = useGetMainWallet();
  const fund = useFundFromMainMutation();
  const { status, summary, run } = useSignAction();
  const [tab, setTab] = useState<AddFundsTab>('crypto');
  const mainBalance = mainWallet?.balance ?? 0;

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferFormSchema(t, mainBalance)),
    defaultValues: initialTransferFormData,
    mode: 'onChange',
  });
  const amount = form.watch('amount');

  const onSubmit = async (values: TransferFormData) => {
    const ok = await run({ kind: 'transfer', summary: `Transfer ${values.amount} USD8 to ${pass?.name}` }, () => fund.mutateAsync(values));
    if (!ok) return;
    toast.success(t('add-funds.transfer.toasts.done', { amount: money(values.amount), name: pass?.name }));
    close();
  };

  return {
    t,
    tab,
    created: !!pass,
    address: pass?.address,
    network: NETWORKS[pass?.network ?? 'base'],
    mainBalance,
    form,
    amount: Number.isFinite(amount) ? amount : 0,
    status,
    summary,
    isLoading: status === 'waiting' || fund.isPending,
    onTabChange: (next: string) => setTab(next as AddFundsTab),
    onCreateSignetPass: () => open('create-signetpass'),
    onSubmit,
  };
};
