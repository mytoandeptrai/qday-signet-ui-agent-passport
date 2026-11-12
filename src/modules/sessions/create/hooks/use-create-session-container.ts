import { useGetBalance, useGetSettings } from '@/apis/account';
import { useCreateSessionMutation } from '@/apis/sessions';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { useSignAction } from '@/integrations/wallet';
import { money } from '@/lib/format';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AGENTS, type CreateSessionFormData, createSessionFormSchema } from './schema';

const DEFAULT_DURATION_HOURS = 8;

export const useCreateSessionContainer = () => {
  const { t } = useTranslation('create-session-page');
  const { params } = useAppDialog();
  const navigate = useNavigate();
  const { data: settings } = useGetSettings();
  const { data: balance } = useGetBalance();
  const createSession = useCreateSessionMutation();
  const { status, summary, run } = useSignAction();
  const available = balance?.available ?? 0;

  const form = useForm<CreateSessionFormData>({
    resolver: zodResolver(createSessionFormSchema(t, available)),
    values: settings
      ? {
          task: params.task ?? '',
          agent: AGENTS[0],
          limit: settings.defaultLimit,
          perCallLimit: settings.defaultPerCallLimit,
          durationHours: DEFAULT_DURATION_HOURS,
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

  return { t, form, available, status, summary, isLoading: status === 'waiting' || createSession.isPending, onSubmit };
};
