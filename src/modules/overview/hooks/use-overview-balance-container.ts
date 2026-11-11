import { useGetBalance, useGetOnboarding, useGetProfile, useGetSettings } from '@/apis/account';
import { useGetSessionList } from '@/apis/sessions';
import { useTranslation } from '@/integrations/i18n';
import { toast } from 'sonner';

export const useOverviewBalanceContainer = () => {
  const { t } = useTranslation('overview-page');
  const { data: user } = useGetProfile();
  const { data: balance } = useGetBalance();
  const { data: settings } = useGetSettings();
  const { data: onboarding } = useGetOnboarding();
  const { data: sessions = [] } = useGetSessionList();

  const active = sessions.filter((s) => s.status === 'active');
  const activeLimit = active.reduce((n, s) => n + s.limit, 0);
  const activeSpent = active.reduce((n, s) => n + s.spent, 0);

  const onCopyAddress = () => {
    navigator.clipboard?.writeText(user?.walletAddress ?? '').catch(() => undefined);
    toast.success(t('toasts.address-copied'));
  };

  return {
    available: balance?.available ?? 0,
    walletAddress: user?.walletAddress,
    allowanceConfigured: onboarding?.allowance ?? false,
    defaultLimit: settings?.defaultLimit ?? 0,
    activeLimit,
    activeSpent,
    onCopyAddress,
  };
};
