import { useMediaQuery } from '@/hooks/use-media-query';

/** The OS-level color scheme, kept in sync when the user switches it while the app is open. */
export function useSystemColorScheme(): 'light' | 'dark' {
  return useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
}
