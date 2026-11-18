import { useGetServiceList } from '@/apis/services';
import { PARTNERS } from '@/mock/landing';
import { useTranslation } from '@/integrations/i18n';

export const useEcosystemContainer = () => {
  const { t } = useTranslation('ecosystem-page');
  const { data } = useGetServiceList({});

  return { t, featured: (data?.items ?? []).filter((s) => s.popular), partners: PARTNERS };
};
