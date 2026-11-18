import { useGetBalance, useGetSettings } from '@/apis/account';
import { useGetAgentList } from '@/apis/agents';
import { useCreateSessionMutation } from '@/apis/sessions';
import { useGetSignetPasses } from '@/apis/signetpass';
import { ROUTES } from '@/constant';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { useSignAction } from '@/integrations/wallet';
import { money } from '@/lib/format';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type CreateSessionFormData, createSessionFormSchema } from './schema';

const DEFAULT_DURATION_HOURS = 8;

export const useCreateSessionContainer = () => {
  const { t } = useTranslation('create-session-page');
  const { params, open } = useAppDialog();
  const { data: agents = [] } = useGetAgentList();
  const navigate = useNavigate();
  const { data: settings } = useGetSettings();
  const { data: balance } = useGetBalance();
  const { data: passes } = useGetSignetPasses();
  const createSession = useCreateSessionMutation();
  const { status, summary, run } = useSignAction();
  const available = balance?.available ?? 0;
  // Only agents the user approved on the selected SignetPass can hold a session.
  const agentNames = agents.filter((a) => a.status === 'active').map((a) => a.name);

  const form = useForm<CreateSessionFormData>({
    resolver: zodResolver(createSessionFormSchema(t, available)),
    values: settings
      ? {
          task: params.task ?? '',
          agent: agentNames.includes(params.agent ?? '') ? (params.agent as string) : (agentNames[0] ?? ''),
          limit: params.limit ?? settings.defaultLimit,
          perCallLimit: params.perCall ?? settings.defaultPerCallLimit,
          durationHours: params.hours ?? DEFAULT_DURATION_HOURS,
        }
      : undefined,
    mode: 'onChange',
  });

  const onSubmit = async (values: CreateSessionFormData) => {
    let sessionId = '';
    const ok = await run({ kind: 'create-session', summary: `Create session: ${values.task}` }, async () => {
      sessionId = (await createSession.mutateAsync(values)).id;
    });
    if (!ok) return;
    toast.success(t('toasts.created'), { description: t('toasts.held', { amount: money(values.limit), agent: values.agent }) });
    navigate({ to: '/sessions/$sessionId', params: { sessionId } });
  };

  return {
    t,
    form,
    available,
    agentNames,
    needsActivation: !!passes?.selected && passes.selected.status !== 'active',
    status,
    summary,
    isLoading: status === 'waiting' || createSession.isPending,
    onActivate: () => open('activate-signetpass'),
    onRegisterAgent: () => navigate({ to: ROUTES.AGENTS }),
    onSubmit,
  };
};
