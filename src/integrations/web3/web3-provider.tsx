import '@rainbow-me/rainbowkit/styles.css';

import { darkTheme, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { type ReactNode, useMemo } from 'react';
import { WagmiProvider } from 'wagmi';
import { WalletEvents } from '../wallet';
import { LANGUAGES, useTranslation } from '../i18n';
import { useTheme } from '../theme/theme-context';
import { useSystemColorScheme } from '../theme/use-system-color-scheme';
import { wagmiConfig } from './config';

function RainbowKitThemedProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const systemColorScheme = useSystemColorScheme();
  const colorScheme = theme === 'system' ? systemColorScheme : theme;
  const { i18n } = useTranslation();
  const walletLocale = LANGUAGES.find((language) => language.code === i18n.resolvedLanguage)?.walletLocale ?? 'en-US';
  const rainbowKitTheme = useMemo(() => (colorScheme === 'dark' ? darkTheme() : lightTheme()), [colorScheme]);

  return (
    <RainbowKitProvider theme={rainbowKitTheme} modalSize='compact' locale={walletLocale}>
      <WalletEvents />
      {children}
    </RainbowKitProvider>
  );
}

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitThemedProvider>{children}</RainbowKitThemedProvider>
    </WagmiProvider>
  );
}
