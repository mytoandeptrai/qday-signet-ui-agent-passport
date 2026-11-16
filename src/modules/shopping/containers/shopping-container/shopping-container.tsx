import { PageHeader } from '@/components/ui/page-header';
import { useTranslation } from '@/integrations/i18n';

const ShoppingContainer = () => {
  const { t } = useTranslation('shopping-page');
  return (
    <div>
      <PageHeader title={t('title')} />
      <p className='text-body text-muted-foreground'>{t('coming-soon')}</p>
    </div>
  );
};

export default ShoppingContainer;
