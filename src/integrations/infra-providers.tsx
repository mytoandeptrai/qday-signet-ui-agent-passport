import { HelmetProvider } from './helmet/helmet-provider';
import { I18nProvider } from './i18n';
import { QueryProvider } from './tanstack-query/query-provider';
import { ThemeProvider } from './theme/theme-provider';

export function InfraProviders({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <HelmetProvider>
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </HelmetProvider>
    </I18nProvider>
  );
}
