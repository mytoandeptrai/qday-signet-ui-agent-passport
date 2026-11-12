import { useGetBalance, useGetOnboarding, useGetSettings } from '@/apis/account';
import { useGetSignetPasses } from '@/apis/signetpass';
import { useGetSessionList } from '@/apis/sessions';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { toast } from 'sonner';

export const useOverviewBalanceContainer = () => {
  const { t } = useTranslation('overview-page');
  const { open } = useAppDialog();
  const { data: passes } = useGetSignetPasses();
  const pass = passes?.selected;
  const { data: balance } = useGetBalance();
  const { data: settings } = useGetSettings();
  const { data: onboarding } = useGetOnboarding();
  const { data: sessions = [] } = useGetSessionList();

  const active = sessions.filter((s) => s.status === 'active');
  const activeLimit = active.reduce((n, s) => n + s.limit, 0);
  const activeSpent = active.reduce((n, s) => n + s.spent, 0);

  const onCopyAddress = () => {
    navigator.clipboard?.writeText(pass?.address ?? '').catch(() => undefined);
    toast.success(t('toasts.address-copied'));
  };

  return {
    available: balance?.available ?? 0,
    pass,
    allowanceConfigured: onboarding?.allowance ?? false,
    defaultLimit: settings?.defaultLimit ?? 0,
    activeLimit,
    activeSpent,
    onCopyAddress,
    onAddFunds: () => open('add-funds'),
  };
};
