import { useGetMainWallet, useSendFromMainMutation } from '@/apis/wallet';
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
  const { status, run } = useSignAction();
  const available = wallet?.balance ?? 0;

  const form = useForm<SendFormData>({
    resolver: zodResolver(sendFormSchema(t, available)),
    defaultValues: initialSendFormData,
    mode: 'onChange',
  });
  const amount = form.watch('amount');

  const onSubmit = async (values: SendFormData) => {
    const ok = await run({ kind: 'transfer', summary: `Send ${values.amount} USD8` }, () => send.mutateAsync(values));
    if (!ok) return;
    toast.success(t('send.toasts.sent', { amount: money(values.amount) }));
    close();
  };

  return {
    t,
    form,
    available,
    amount: Number.isFinite(amount) ? amount : 0,
    status,
    isLoading: status === 'waiting' || send.isPending,
    onSubmit,
  };
};
