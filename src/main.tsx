import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from './components/ui/error-boundary.tsx';
import LoadingSpinner from './components/ui/loading-spinner.tsx';
import { Toaster } from './components/ui/sonner';
import { InfraProviders } from './integrations/infra-providers.tsx';
import { queryClient } from './integrations/tanstack-query/query-provider.tsx';
import { routeTree } from './routeTree.gen';
import './styles.css';

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <InfraProviders>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <RouterProvider router={router} />
          </Suspense>
        </ErrorBoundary>
        <Toaster richColors position='top-right' />
      </InfraProviders>
    </StrictMode>
  );
}
