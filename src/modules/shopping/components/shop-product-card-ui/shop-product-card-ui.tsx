import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import { type ShopProduct, formatPrice, inStock, lowStock, maxQuantity } from '../../utils';
import ShopProductThumbUi from '../shop-product-thumb-ui';
import ShopQuantityStepperUi from '../shop-quantity-stepper-ui';

interface ShopProductCardUiProps {
  product: ShopProduct;
  token: string;
  inCart: number;
  onOpen: () => void;
  onAdd: () => void;
  onQuantity: (quantity: number) => void;
}

const ShopProductCardUi = ({ product, token, inCart, onOpen, onAdd, onQuantity }: ShopProductCardUiProps) => {
  const { t } = useTranslation('shopping-page');
  const available = inStock(product);
  const left = lowStock(product);
  return (
    <li className='flex flex-col gap-4 bg-background p-4'>
      <button
        type='button'
        onClick={onOpen}
        aria-label={t('product.view', { name: product.name })}
        className='flex min-w-0 items-center gap-3 text-left focus-visible:outline-2 focus-visible:outline-ring'
      >
        <ShopProductThumbUi product={product} className={cn('size-16', !available && 'opacity-40 grayscale')} />
        <span className='min-w-0 flex-1'>
          <span className='block truncate text-body font-medium'>{product.name}</span>
          <span className='block truncate text-small text-muted-foreground'>
            {product.merchant.name} · {product.category}
          </span>
          <span className='mt-1 flex items-baseline gap-1.5'>
            <span className='text-body font-medium tabular-nums'>{formatPrice(product.price)}</span>
            <span className='text-small text-muted-foreground'>{token}</span>
            {left !== null && (
              <span className={cn('ml-1 text-small', available ? 'text-foreground' : 'text-destructive')}>
                {available ? t('product.low-stock', { count: left }) : t('product.out-of-stock')}
              </span>
            )}
          </span>
        </span>
      </button>
      {inCart > 0 ? (
        <ShopQuantityStepperUi name={product.name} quantity={inCart} max={maxQuantity(product)} onChange={onQuantity} />
      ) : (
        <Button
          type='button'
          variant='outline'
          aria-label={t('product.add-aria', { name: product.name })}
          disabled={!available}
          onClick={onAdd}
        >
          {available ? (
            <>
              <PlusIcon />
              {t('product.add')}
            </>
          ) : (
            t('product.sold-out')
          )}
        </Button>
      )}
    </li>
  );
};

export default ShopProductCardUi;
