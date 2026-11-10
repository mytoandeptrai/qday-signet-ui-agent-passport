import type { ReactNode } from 'react';
import './config';

export function I18nProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
