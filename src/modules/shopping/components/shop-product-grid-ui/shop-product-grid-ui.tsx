import { SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import type { ShopProduct } from '../../utils';
import ShopProductCardUi from '../shop-product-card-ui';

interface ShopProductGridUiProps {
  products: ShopProduct[];
  total: number;
  hasMore: boolean;
  pageSize: number;
  token: string;
  filtered: boolean;
  quantityOf: (productId: string) => number;
  onOpen: (product: ShopProduct) => void;
  onAdd: (productId: string) => void;
  onQuantity: (productId: string, quantity: number) => void;
  onShowMore: () => void;
  onClearFilters: () => void;
}

const ShopProductGridUi = ({
  products,
  total,
  hasMore,
  pageSize,
  token,
  filtered,
  quantityOf,
  onOpen,
  onAdd,
  onQuantity,
  onShowMore,
  onClearFilters,
}: ShopProductGridUiProps) => {
  const { t } = useTranslation('shopping-page');
  if (products.length === 0)
    return (
      <div className='mt-8 flex flex-col items-center gap-2 border border-dashed py-14 text-center'>
        <SearchIcon className='size-6 text-muted-foreground' strokeWidth={1.4} aria-hidden='true' />
        <p className='font-medium'>{t('empty.title')}</p>
        <p className='text-small text-muted-foreground'>{t('empty.hint')}</p>
        {filtered && (
          <Button variant='outline' className='mt-2' onClick={onClearFilters}>
            {t('empty.clear')}
          </Button>
        )}
      </div>
    );
  return (
    <>
      <p className='mt-6 mb-2 text-small text-muted-foreground'>{t('results.count', { count: total })}</p>
      <ul className='grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3' aria-label={t('results.label')}>
        {products.map((product) => (
          <ShopProductCardUi
            key={product.id}
            product={product}
            token={token}
            inCart={quantityOf(product.id)}
            onOpen={() => onOpen(product)}
            onAdd={() => onAdd(product.id)}
            onQuantity={(quantity) => onQuantity(product.id, quantity)}
          />
        ))}
      </ul>
      <p role='status' className='mt-4 text-center text-small text-muted-foreground'>
        {t('results.showing', { shown: products.length, total })}
      </p>
      {hasMore && (
        <div className='mt-2 flex justify-center'>
          <Button variant='outline' onClick={onShowMore}>
            {t('results.more', { count: pageSize })}
          </Button>
        </div>
      )}
    </>
  );
};

export default ShopProductGridUi;
