import { PlusIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from '@/integrations/i18n';
import { type ShopProduct, formatPrice, inStock } from '../../utils';
import ShopProductThumbUi from '../shop-product-thumb-ui';

interface ShopProductDialogUiProps {
  product: ShopProduct | null;
  token: string;
  chainName: string;
  inCart: number;
  onClose: () => void;
  onAdd: () => void;
}

const ShopProductDialogUi = ({ product, token, chainName, inCart, onClose, onAdd }: ShopProductDialogUiProps) => {
  const { t } = useTranslation('shopping-page');
  return (
    <Dialog open={Boolean(product)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product?.name}</DialogTitle>
          <DialogDescription>{product?.description}</DialogDescription>
        </DialogHeader>
        {product && (
          <>
            <ShopProductThumbUi product={product} className='h-36 w-full' iconClassName='size-12' />
            <dl className='grid grid-cols-[120px_1fr] items-center gap-y-3 text-body'>
              <dt className='text-muted-foreground'>{t('product.shop')}</dt>
              <dd>
                {product.merchant.name} · {product.category}
              </dd>
              <dt className='text-muted-foreground'>{t('product.delivery')}</dt>
              <dd>{product.fulfillment}</dd>
              <dt className='text-muted-foreground'>{t('product.paid-in')}</dt>
              <dd>{t('product.paid-in-value', { token, chain: chainName })}</dd>
            </dl>
            <div className='flex flex-wrap gap-1.5'>
              {product.tags.map((tag) => (
                <Badge key={tag} variant='outline' className='font-normal'>
                  {tag}
                </Badge>
              ))}
            </div>
          </>
        )}
        <DialogFooter className='items-center sm:justify-between'>
          {product && (
            <div>
              <p className='text-lead font-medium tabular-nums'>
                {formatPrice(product.price)} {token}
              </p>
              {inCart > 0 && (
                <p className='text-small text-muted-foreground'>{t('product.in-cart', { count: inCart })}</p>
              )}
            </div>
          )}
          <Button type='button' disabled={product ? !inStock(product) : true} onClick={onAdd}>
            <PlusIcon />
            {product && !inStock(product) ? t('product.sold-out') : t('product.add-to-cart')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShopProductDialogUi;
