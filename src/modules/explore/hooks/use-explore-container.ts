import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { type Service, useGetServiceList } from '@/apis/services';
import { ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { SERVICE_PAGE_SIZE } from '@/mock/api';
import { MARKETPLACE_SERVICE_COUNT, SERVICE_CATEGORIES } from '@/mock/services';
import { usePassportStore } from '@/stores/passport-store';
import { SORTS } from './schema';

const route = getRouteApi('/(public)/explore');

export const useExploreContainer = () => {
  const { t } = useTranslation('explore-page');
  const navigate = useNavigate();
  const { q = '', category = 'All', sort = 'popular', page = 1 } = route.useSearch();
  const isSignedIn = usePassportStore((s) => Boolean(s.user));
  const [search, setSearch] = useState(q);
  const [picked, setPicked] = useState<Service | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data, isFetching } = useGetServiceList({ search: q, category, sort, page });
  const services = data?.items ?? [];
  const pageCount = Math.max(1, Math.ceil((data?.total ?? 0) / SERVICE_PAGE_SIZE));

  const setParams = (patch: { q?: string; category?: string; sort?: (typeof SORTS)[number]; page?: number }) =>
    navigate({ to: ROUTES.EXPLORE, search: (prev) => ({ ...prev, page: undefined, ...patch }), replace: true });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (search !== q) setParams({ q: search || undefined });
    }, 250);
    return () => window.clearTimeout(timeout);
    // biome-ignore lint/correctness/useExhaustiveDependencies: only the typed value should restart the debounce
  }, [search]);

  const onUse = () => toast.success(t('toasts.added', { name: picked?.name }));

  return {
    t,
    featuredCount: MARKETPLACE_SERVICE_COUNT,
    categories: SERVICE_CATEGORIES,
    category,
    sort,
    search,
    query: q,
    services,
    isFetching,
    page,
    pageCount,
    picked,
    detailsOpen,
    isSignedIn,
    onSearchChange: setSearch,
    onCategoryChange: (next: string) => setParams({ category: next }),
    onSortChange: (next: (typeof SORTS)[number]) => setParams({ sort: next }),
    onPageChange: (next: number) => setParams({ page: next }),
    onPick: (service: Service) => {
      setDetailsOpen(false);
      setPicked(service);
    },
    onToggleDetails: () => setDetailsOpen((open) => !open),
    onClosePicked: () => setPicked(null),
    onUse,
  };
};
