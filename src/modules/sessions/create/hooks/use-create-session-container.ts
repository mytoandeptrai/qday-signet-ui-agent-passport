import { useGetBalance, useGetSettings } from '@/apis/account';
import { useCreateSessionMutation } from '@/apis/sessions';
import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';
import { zodResolver } from '@hookform/resolvers/zod';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AGENTS, type CreateSessionFormData, createSessionFormSchema } from './schema';

const route = getRouteApi('/(app)/create-session');
const DEFAULT_DURATION_HOURS = 8;

export const useCreateSessionContainer = () => {
  const { t } = useTranslation('create-session-page');
  const { task: presetTask } = route.useSearch();
  const navigate = useNavigate();
  const { data: settings } = useGetSettings();
  const { data: balance } = useGetBalance();
  const createSession = useCreateSessionMutation();
  const available = balance?.available ?? 0;

  const form = useForm<CreateSessionFormData>({
    resolver: zodResolver(createSessionFormSchema(t, available)),
    values: settings
      ? {
          task: presetTask ?? '',
          agent: AGENTS[0],
          limit: settings.defaultLimit,
          perCallLimit: settings.defaultPerCallLimit,
          durationHours: DEFAULT_DURATION_HOURS,
        }
      : undefined,
    mode: 'onChange',
  });

  const onSubmit = async (values: CreateSessionFormData) => {
    const session = await createSession.mutateAsync(values);
    toast.success(t('toasts.created'), { description: t('toasts.held', { amount: money(values.limit), agent: values.agent }) });
    navigate({ to: '/sessions/$sessionId', params: { sessionId: session.id } });
  };

  return { t, form, available, isLoading: createSession.isPending, onSubmit };
};
