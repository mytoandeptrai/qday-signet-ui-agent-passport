import { useGetBalance, useGetOnboarding, useGetSettings } from '@/apis/account';
import { useGetSignetPasses } from '@/apis/signetpass';
import { useGetSessionList } from '@/apis/sessions';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { isMoonPayEnabled } from '@/integrations/moonpay';
import { useActiveNetwork, useWallet } from '@/integrations/wallet';
import { useState } from 'react';
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
  const { address, isConnected } = useWallet();
  const { network, isUnsupported } = useActiveNetwork();
  // 'idle' -> 'opening' (SDK loading + URL signing) -> 'open' (MoonPay overlay showing).
  const [buyState, setBuyState] = useState<'idle' | 'opening' | 'open'>('idle');

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
    // Card purchases deliver USDC on Base, so the option only shows while the wallet is on Base.
    canBuyWithCard: isMoonPayEnabled && isConnected && !!address && !isUnsupported && network.key === 'base',
    buyAddress: address,
    buyState,
    onBuyWithCard: () => setBuyState('opening'),
    buyHandlers: {
      onReady: () => setBuyState('open'),
      onClose: () => setBuyState('idle'),
      onSubmitted: () => toast.success(t('toasts.buy-submitted')),
      onCompleted: () => toast.success(t('toasts.buy-completed')),
      onError: () => {
        setBuyState('idle');
        toast.error(t('toasts.buy-error'));
      },
    },
  };
};
