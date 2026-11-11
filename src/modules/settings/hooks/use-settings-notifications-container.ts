import { useGetSettings, useUpdateSettingsMutation } from '@/apis/account';
import { useTranslation } from '@/integrations/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type NotificationsFormData, notificationsFormSchema } from './schema';

export const useSettingsNotificationsContainer = () => {
  const { t } = useTranslation('settings-page');
  const { data: settings } = useGetSettings();
  const updateSettings = useUpdateSettingsMutation();

  const form = useForm<NotificationsFormData>({
    resolver: zodResolver(notificationsFormSchema),
    values: settings ? { emailAlerts: settings.emailAlerts, alertOnBlocked: settings.alertOnBlocked } : undefined,
  });

  const onSubmit = async (values: NotificationsFormData) => {
    await updateSettings.mutateAsync(values);
    toast.success(t('toasts.saved'));
  };

  return { form, isLoading: updateSettings.isPending, onSubmit };
};
