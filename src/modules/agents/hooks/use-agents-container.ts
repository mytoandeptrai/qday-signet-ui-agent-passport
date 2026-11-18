import { useGetAgentList, useRevokeAgentMutation } from '@/apis/agents';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { useGetSignetPasses } from '@/apis/signetpass';
import { useInstallPrompt } from '@/modules/signetpass/hooks';
import { useState } from 'react';
import { toast } from 'sonner';

export const useAgentsContainer = () => {
  const { t } = useTranslation('agents-page');
  const { open } = useAppDialog();
  const { data: agents = [] } = useGetAgentList();
  const { data: signetPasses } = useGetSignetPasses();
  const install = useInstallPrompt(signetPasses?.selected);
  const revoke = useRevokeAgentMutation();
  const [revokeId, setRevokeId] = useState<string>();

  const target = agents.find((a) => a.id === revokeId);

  const onCopyInstall = () => {
    install.copyPrompt();
    toast.success(t('details.install.copied', { ns: 'signetpass-page' }));
  };

  const onConfirmRevoke = async () => {
    if (!target) return;
    await revoke.mutateAsync({ id: target.id });
    toast.success(t('revoke.toasts.revoked', { agent: target.name }));
    setRevokeId(undefined);
  };

  return {
    t,
    install,
    onCopyInstall,
    pending: agents.filter((a) => a.status === 'pending'),
    registered: agents.filter((a) => a.status !== 'pending'),
    target,
    isRevoking: revoke.isPending,
    onApprove: (id: string) => open('approve-agent', { id }),
    onRevoke: setRevokeId,
    onCloseRevoke: () => setRevokeId(undefined),
    onConfirmRevoke,
  };
};
