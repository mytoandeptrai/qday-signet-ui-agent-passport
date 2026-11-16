import { useFundFromMainMutation, useGetSignetPasses } from '@/apis/signetpass';
import { useGetMainWallet } from '@/apis/wallet';
import { NETWORKS } from '@/constant';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { useSignAction } from '@/integrations/wallet';
import { money } from '@/lib/format';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { initialTransferFormData, type TransferFormData, transferFormSchema } from './schema';

/** Moves funds from the Main Wallet into the selected SignetPass. */
export const useMoveFundsContainer = () => {
  const { t } = useTranslation('signetpass-page');
  const { open, close } = useAppDialog();
  const { data } = useGetSignetPasses();
  const pass = data?.selected;
  const { data: mainWallet } = useGetMainWallet();
  const fund = useFundFromMainMutation();
  const { status, summary, run } = useSignAction();
  const mainBalance = mainWallet?.balance ?? 0;
  const network = NETWORKS[pass?.network ?? mainWallet?.network ?? 'base'];

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferFormSchema(t, mainBalance)),
    defaultValues: initialTransferFormData,
    mode: 'onChange',
  });
  const amount = form.watch('amount');

  const onSubmit = async (values: TransferFormData) => {
    const ok = await run({ kind: 'transfer', summary: `Transfer ${values.amount} ${network.token.symbol} to ${pass?.name}` }, () => fund.mutateAsync(values));
    if (!ok) return;
    toast.success(t('move-funds.toasts.done', { amount: money(values.amount), name: pass?.name }));
    close();
  };

  return {
    t,
    created: !!pass,
    active: pass?.status === 'active',
    passName: pass?.name,
    network,
    mainBalance,
    form,
    amount: Number.isFinite(amount) ? amount : 0,
    status,
    summary,
    isLoading: status === 'waiting' || fund.isPending,
    onCreateSignetPass: () => open('create-signetpass'),
    onActivateSignetPass: () => open('activate-signetpass'),
    onSubmit,
  };
};
