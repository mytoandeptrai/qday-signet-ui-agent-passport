import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { useUpdateSettingsMutation } from '@/apis/account';
import { ROUTES } from '@/constant';
import { useSignAction, useWallet } from '@/integrations/wallet';
import { usePassportStore } from '@/stores/passport-store';
import type { SettingsSheetId } from '../utils';
import { useSettingsAccountContainer } from './use-settings-account-container';

export const useSettingsContainer = () => {
  const { t, user, connectedWallet, signetPass, appearance, onChangeAppearance, onReset } = useSettingsAccountContainer();
  const navigate = useNavigate();
  const { isConnected, connect, disconnect } = useWallet();
  const { status, summary, sign, reset } = useSignAction();
  const updateSettings = useUpdateSettingsMutation();
  const settings = usePassportStore((s) => s.settings);
  const [sheet, setSheet] = useState<SettingsSheetId | null>(null);
  const [autoLock, setAutoLock] = useState(true);

  const passkeyEnabled = settings.passkeyEnabled !== false;

  const onTogglePasskey = async (next: boolean) => {
    if (!isConnected) {
      connect();
      return;
    }
    try {
      await sign({
        kind: next ? 'enable-passkey' : 'disable-passkey',
        summary: next ? 'Turn on passkey for all wallets' : 'Turn off passkey for all wallets',
      });
    } catch {
      return;
    }
    await updateSettings.mutateAsync({ passkeyEnabled: next });
    reset();
    toast.success(t(next ? 'toasts.passkey-on' : 'toasts.passkey-off'));
  };

  const onSoon = (name: string) => toast(name, { description: t('toasts.soon') });

  const onSignOut = () => {
    usePassportStore.getState().signOut();
    void disconnect();
    toast.success(t('toasts.signed-out'));
    navigate({ to: ROUTES.HOME });
  };

  return {
    t,
    user,
    connectedWallet,
    signetPass,
    passkeyEnabled,
    passkeyStatus: status,
    passkeySummary: summary,
    isDark: appearance === 'dark',
    autoLock,
    sheet,
    onTogglePasskey,
    onToggleAutoLock: setAutoLock,
    onToggleDark: (dark: boolean) => onChangeAppearance(dark ? 'dark' : 'light'),
    onOpenSheet: setSheet,
    onCloseSheet: () => setSheet(null),
    onSoon,
    onReset,
    onSignOut,
  };
};
