import { CommentLayerContainer } from '@/modules/comments';
import NavigationProgress from '@/components/ui/navigation-progress';
import { siteConfig } from '@/constant';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { Helmet } from 'react-helmet-async';

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Helmet>
        <title>{siteConfig.title}</title>
        <meta name='description' content={siteConfig.description} />
        <meta property='og:title' content={siteConfig.title} />
        <meta property='og:description' content={siteConfig.description} />
      </Helmet>
      <NavigationProgress />
      <Outlet />
      <CommentLayerContainer />
    </>
  ),
});
