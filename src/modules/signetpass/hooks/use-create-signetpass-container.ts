import { useCreateSignetPassMutation, useGetSignetPasses } from '@/apis/signetpass';
import { NETWORKS } from '@/constant';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { useSignAction, useWallet } from '@/integrations/wallet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type CreateSignetPassFormData, createSignetPassFormSchema, initialCreateSignetPassFormData } from './schema';

export const useCreateSignetPassContainer = () => {
  const { t } = useTranslation('signetpass-page');
  const { close } = useAppDialog();
  const { address } = useWallet();
  const { data } = useGetSignetPasses();
  const createSignetPass = useCreateSignetPassMutation();
  const { status, summary, run } = useSignAction();
  const takenNames = (data?.passes ?? []).map((p) => p.name.toLowerCase());

  const form = useForm<CreateSignetPassFormData>({
    resolver: zodResolver(createSignetPassFormSchema(t, takenNames)),
    defaultValues: initialCreateSignetPassFormData,
    mode: 'onChange',
  });

  const onSubmit = async (values: CreateSignetPassFormData) => {
    const network = NETWORKS[values.network];
    const ok = await run({ kind: 'create-signetpass', summary: `Create SignetPass "${values.name}" on ${network.name}` }, () =>
      createSignetPass.mutateAsync(values)
    );
    if (!ok) return;
    toast.success(t('create.toasts.created', { name: values.name }));
    close();
  };

  return {
    t,
    owner: address,
    form,
    status,
    summary,
    isLoading: status === 'waiting' || createSignetPass.isPending,
    onSubmit,
  };
};
