import { useGetMainWallet, useSendFromMainMutation } from '@/apis/wallet';
import { NETWORKS } from '@/constant';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { useSignAction } from '@/integrations/wallet';
import { money } from '@/lib/format';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { initialSendFormData, type SendFormData, sendFormSchema } from './schema';

export const useSendContainer = () => {
  const { t } = useTranslation('wallet-page');
  const { close } = useAppDialog();
  const { data: wallet } = useGetMainWallet();
  const send = useSendFromMainMutation();
  const { status, summary, run } = useSignAction();
  const available = wallet?.balance ?? 0;
  const symbol = NETWORKS[wallet?.network ?? 'base'].token.symbol;

  const form = useForm<SendFormData>({
    resolver: zodResolver(sendFormSchema(t, available)),
    defaultValues: initialSendFormData,
    mode: 'onChange',
  });
  const amount = form.watch('amount');

  const onSubmit = async (values: SendFormData) => {
    const ok = await run({ kind: 'transfer', summary: `Send ${values.amount} ${symbol}` }, () => send.mutateAsync(values));
    if (!ok) return;
    toast.success(t('send.toasts.sent', { amount: money(values.amount), token: symbol }));
    close();
  };

  return {
    t,
    form,
    symbol,
    available,
    amount: Number.isFinite(amount) ? amount : 0,
    status,
    summary,
    isLoading: status === 'waiting' || send.isPending,
    onSubmit,
  };
};
