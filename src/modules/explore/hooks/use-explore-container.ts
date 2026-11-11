import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { type Service, useGetServiceList } from '@/apis/services';
import { ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import { SERVICE_CATEGORIES, SERVICES } from '@/mock/services';
import { usePassportStore } from '@/stores/passport-store';
import { SORTS } from './schema';

const route = getRouteApi('/(public)/explore');

export const useExploreContainer = () => {
  const { t } = useTranslation('explore-page');
  const navigate = useNavigate();
  const { q = '', category = 'All', sort = 'popular' } = route.useSearch();
  const isSignedIn = usePassportStore((s) => Boolean(s.user));
  const [search, setSearch] = useState(q);
  const [picked, setPicked] = useState<Service | null>(null);

  const { data: services = [], isFetching } = useGetServiceList({ search: q, category, sort });

  const setParams = (patch: { q?: string; category?: string; sort?: (typeof SORTS)[number] }) =>
    navigate({ to: ROUTES.EXPLORE, search: (prev) => ({ ...prev, ...patch }), replace: true });

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
    featuredCount: SERVICES.length,
    categories: SERVICE_CATEGORIES,
    category,
    sort,
    search,
    query: q,
    services,
    isFetching,
    picked,
    isSignedIn,
    onSearchChange: setSearch,
    onCategoryChange: (next: string) => setParams({ category: next }),
    onSortChange: (next: (typeof SORTS)[number]) => setParams({ sort: next }),
    onPick: setPicked,
    onClosePicked: () => setPicked(null),
    onUse,
  };
};
