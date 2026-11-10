import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      retry: 0,
    },
    mutations: {
      onError: (error) => {
        console.error(error);
      },
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
