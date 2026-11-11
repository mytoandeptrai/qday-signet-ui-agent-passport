import { useGetSettings, useUpdateSettingsMutation } from '@/apis/account';
import { useTranslation } from '@/integrations/i18n';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type LimitsFormData, limitsFormSchema } from './schema';

export const useSettingsLimitsContainer = () => {
  const { t } = useTranslation('settings-page');
  const { data: settings } = useGetSettings();
  const updateSettings = useUpdateSettingsMutation();

  const form = useForm<LimitsFormData>({
    resolver: zodResolver(limitsFormSchema(t)),
    values: settings
      ? {
          defaultLimit: settings.defaultLimit,
          defaultPerCallLimit: settings.defaultPerCallLimit,
          requireApprovalAbove: settings.requireApprovalAbove,
        }
      : undefined,
    mode: 'onChange',
  });

  const onSubmit = async (values: LimitsFormData) => {
    await updateSettings.mutateAsync(values);
    toast.success(t('toasts.saved'));
  };

  return { form, isLoading: updateSettings.isPending, onSubmit };
};
