import { useGetProfile, useGetSettings, useResetDemoDataMutation, useUpdateSettingsMutation } from '@/apis/account';
import { useWallet } from '@/integrations/wallet';
import { useTranslation } from '@/integrations/i18n';
import { useTheme } from '@/integrations/theme/theme-context';
import type { Appearance } from '@/types/passport';
import { toast } from 'sonner';

export const useSettingsAccountContainer = () => {
  const { t } = useTranslation('settings-page');
  const { data: user } = useGetProfile();
  const { data: settings } = useGetSettings();
  const updateSettings = useUpdateSettingsMutation();
  const resetDemoData = useResetDemoDataMutation();
  const { setTheme } = useTheme();
  const { address: connectedWallet } = useWallet();

  const onChangeAppearance = (appearance: Appearance) => {
    updateSettings.mutate({ appearance });
    setTheme(appearance);
  };

  const onReset = async () => {
    await resetDemoData.mutateAsync();
    toast.success(t('toasts.reset'));
  };

  return { user, connectedWallet, appearance: settings?.appearance, onChangeAppearance, onReset };
};
