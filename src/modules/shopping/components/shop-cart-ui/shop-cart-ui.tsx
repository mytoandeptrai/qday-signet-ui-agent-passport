import { ShoppingCartIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { type PricedLine, formatAtomic, formatPrice, maxQuantity } from '../../utils';
import ShopProductThumbUi from '../shop-product-thumb-ui';
import ShopQuantityStepperUi from '../shop-quantity-stepper-ui';

interface ShopCartUiProps {
  lines: PricedLine[];
  total: bigint;
  token: string;
  chainName: string;
  hasUnpayable: boolean;
  hasAddress: boolean;
  onQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
  onBrowse: () => void;
}

const ShopCartUi = ({
  lines,
  total,
  token,
  chainName,
  hasUnpayable,
  hasAddress,
  onQuantity,
  onRemove,
  onCheckout,
  onBrowse,
}: ShopCartUiProps) => {
  const { t } = useTranslation('shopping-page');
  if (lines.length === 0)
    return (
      <div className='flex flex-col items-center gap-2 border border-dashed py-14 text-center'>
        <ShoppingCartIcon className='size-6 text-muted-foreground' strokeWidth={1.4} aria-hidden='true' />
        <p className='font-medium'>{t('cart.empty-title')}</p>
        <p className='text-small text-muted-foreground'>{t('cart.empty-hint')}</p>
        <Button variant='outline' className='mt-2' onClick={onBrowse}>
          {t('cart.browse')}
        </Button>
      </div>
    );
  return (
    <div className='max-w-3xl'>
      <ul className='divide-y border' aria-label={t('cart.label')}>
        {lines.map(({ product, quantity, total: lineTotal, payable }) => (
          <li key={product.id} className='flex items-center gap-3 p-4'>
            <ShopProductThumbUi product={product} className='size-14' iconClassName='size-6' />
            <div className='min-w-0 flex-1'>
              <p className='truncate text-body font-medium'>{product.name}</p>
              <p className='truncate text-small text-muted-foreground'>{product.merchant.name}</p>
              {!payable && (
                <p className='text-small text-destructive'>{t('cart.not-accepted', { chain: chainName })}</p>
              )}
            </div>
            <ShopQuantityStepperUi
              name={product.name}
              quantity={quantity}
              max={maxQuantity(product)}
              className='w-28 shrink-0'
              onChange={(n) => onQuantity(product.id, n)}
            />
            <div className='w-28 shrink-0 text-right'>
              <p className='text-body tabular-nums'>
                {formatAtomic(lineTotal)} {token}
              </p>
              {quantity > 1 && (
                <p className='text-small text-muted-foreground'>
                  {t('cart.each', { price: formatPrice(product.price) })}
                </p>
              )}
            </div>
            <Button
              type='button'
              variant='ghost'
              size='icon-sm'
              aria-label={t('cart.remove', { name: product.name })}
              onClick={() => onRemove(product.id)}
            >
              <Trash2Icon />
            </Button>
          </li>
        ))}
      </ul>
      {hasUnpayable && (
        <p role='alert' className='mt-3 text-small text-destructive'>
          {t('cart.unpayable', { chain: chainName })}
        </p>
      )}
      <Button className='mt-4' disabled={hasUnpayable || !hasAddress} onClick={onCheckout}>
        {t('cart.checkout', { total: formatAtomic(total), token })}
      </Button>
      {!hasAddress && <p className='mt-2 text-small text-muted-foreground'>{t('account.no-address')}</p>}
    </div>
  );
};

export default ShopCartUi;
