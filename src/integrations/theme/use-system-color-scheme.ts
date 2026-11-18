import { useMediaQuery } from '@/hooks/use-media-query';

export function useSystemColorScheme(): 'light' | 'dark' {
  return useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';
}
