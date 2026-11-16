import { useCreateSignetPassMutation, useGetSignetPasses } from '@/apis/signetpass';
import { useGetMainWallet } from '@/apis/wallet';
import { NETWORKS, PASS_FEE } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { useSignAction, useWallet } from '@/integrations/wallet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type CreateSignetPassFormData, createSignetPassFormSchema, initialCreateSignetPassFormData } from './schema';

export const useCreateSignetPassContainer = () => {
  const { t } = useTranslation('signetpass-page');
  const navigate = useNavigate();
  const { address } = useWallet();
  const { data } = useGetSignetPasses();
  const { data: mainWallet } = useGetMainWallet();
  const createSignetPass = useCreateSignetPassMutation();
  const { status, summary, run } = useSignAction();
  const takenNames = (data?.passes ?? []).map((p) => p.name.toLowerCase());
  const network = NETWORKS[mainWallet?.network ?? 'base'];
  const balance = mainWallet?.balance ?? 0;
  const insufficient = balance < PASS_FEE;

  const form = useForm<CreateSignetPassFormData>({
    resolver: zodResolver(createSignetPassFormSchema(t, takenNames)),
    defaultValues: initialCreateSignetPassFormData,
    mode: 'onChange',
  });

  // Creating is signed in MetaMask and pays the fee from the Main Wallet. Activating the pass afterwards is free and unsigned.
  const onSubmit = async (values: CreateSignetPassFormData) => {
    const result: { id?: string } = {};
    const ok = await run({ kind: 'create-signetpass', summary: `Create SignetPass "${values.name}" on ${network.name}` }, async () => {
      result.id = (await createSignetPass.mutateAsync(values)).id;
    });
    if (!ok || !result.id) return;
    toast.success(t('create.toasts.created', { name: values.name }));
    // Leaves the page the dialog was opened on, which also closes the dialog.
    navigate({ to: '/signetpass/$passId', params: { passId: result.id } });
  };

  return {
    t,
    owner: address,
    network,
    balance,
    fee: PASS_FEE,
    insufficient,
    form,
    status,
    summary,
    isLoading: status === 'waiting' || createSignetPass.isPending,
    onSubmit,
  };
};
