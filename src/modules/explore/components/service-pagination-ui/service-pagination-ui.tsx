import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';

type ServicePaginationUiProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

const ServicePaginationUi = ({ page, pageCount, onPageChange }: ServicePaginationUiProps) => {
  const { t } = useTranslation('explore-page');
  if (pageCount <= 1) return null;
  return (
    <nav aria-label={t('pagination.label')} className='mt-6 flex items-center justify-between gap-4'>
      <Button variant='outline' disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        {t('pagination.previous')}
      </Button>
      <span className='text-body tabular-nums text-muted-foreground'>{t('pagination.status', { page, count: pageCount })}</span>
      <Button variant='outline' disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
        {t('pagination.next')}
      </Button>
    </nav>
  );
};

export default ServicePaginationUi;
