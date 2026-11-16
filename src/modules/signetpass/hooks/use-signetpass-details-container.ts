import { useGetSignetPass, useGetSignetPasses, useRenameSignetPassMutation, useSelectSignetPassMutation } from '@/apis/signetpass';
import { NETWORKS } from '@/constant';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { getRouteApi, useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type CreateSignetPassFormData, createSignetPassFormSchema, initialCreateSignetPassFormData } from './schema';
import { useInstallPrompt } from './use-install-prompt';

const route = getRouteApi('/(app)/signetpass/$passId');

export const useSignetpassDetailsContainer = () => {
  const { t } = useTranslation('signetpass-page');
  const { passId } = route.useParams();
  const hash = useLocation({ select: (l) => l.hash });
  const { open } = useAppDialog();
  const { data: pass, isLoading } = useGetSignetPass(passId);
  const { data: passes } = useGetSignetPasses();
  const { mutate: selectPass } = useSelectSignetPassMutation();
  const rename = useRenameSignetPassMutation();
  const install = useInstallPrompt();
  const [renaming, setRenaming] = useState(false);

  // Sessions, Agents and Activity follow the selected pass, so opening a pass selects it.
  const selectedId = passes?.selected?.id;
  useEffect(() => {
    if (pass && selectedId !== pass.id) selectPass({ id: pass.id });
  }, [pass, selectedId, selectPass]);

  useEffect(() => {
    if (pass && hash) document.getElementById(hash)?.scrollIntoView();
  }, [pass, hash]);

  const takenNames = (passes?.passes ?? []).filter((p) => p.id !== passId).map((p) => p.name.toLowerCase());
  const form = useForm<CreateSignetPassFormData>({
    resolver: zodResolver(createSignetPassFormSchema(t, takenNames)),
    defaultValues: initialCreateSignetPassFormData,
    mode: 'onChange',
  });

  const onOpenRename = () => {
    form.reset({ name: pass?.name ?? '' });
    setRenaming(true);
  };

  const onRename = async (values: CreateSignetPassFormData) => {
    await rename.mutateAsync({ id: passId, name: values.name });
    toast.success(t('details.rename.done', { name: values.name.trim() }));
    setRenaming(false);
  };

  const onCopyInstall = () => {
    install.copyPrompt();
    toast.success(t('details.install.copied'));
  };

  return {
    t,
    pass,
    isLoading,
    network: NETWORKS[pass?.network ?? 'base'],
    prompt: install.prompt,
    windows: install.windows,
    renaming,
    form,
    isRenaming: rename.isPending,
    onToggleWindows: install.onToggleWindows,
    onCopyInstall,
    onOpenRename,
    onCloseRename: () => setRenaming(false),
    onRename,
    onAddFunds: () => open('fund-signetpass'),
    onActivate: () => open('activate-signetpass'),
    onCreateSession: () => open('create-session'),
  };
};
