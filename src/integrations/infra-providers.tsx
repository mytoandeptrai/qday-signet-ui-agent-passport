import { HelmetProvider } from './helmet/helmet-provider';
import { I18nProvider } from './i18n';
import { QueryProvider } from './tanstack-query/query-provider';
import { ThemeProvider } from './theme/theme-provider';
import { Web3Provider } from './web3';

export function InfraProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <HelmetProvider>
        <ThemeProvider>
          <QueryProvider>
            <Web3Provider>{children}</Web3Provider>
          </QueryProvider>
        </ThemeProvider>
      </HelmetProvider>
    </I18nProvider>
  );
}
