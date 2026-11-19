import { ShoppingCartIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ECOMMERCE_ACCOUNT_URL } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import type { EcommerceAccount } from '@/types/passport';
import { type PricedLine, formatAtomic, formatPrice, maxQuantity } from '../../utils';
import ShopProductThumbUi from '../shop-product-thumb-ui';
import ShopQuantityStepperUi from '../shop-quantity-stepper-ui';

export interface CartGroup {
  merchant: { id: string; name: string };
  lines: PricedLine[];
  total: bigint;
  account: EcommerceAccount | null;
  hasAddress: boolean;
  hasUnpayable: boolean;
}

interface ShopCartUiProps {
  groups: CartGroup[];
  token: string;
  chainName: string;
  onQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onLogin: (merchantId: string) => void;
  onLogout: (merchantId: string) => void;
  onCheckout: (merchantId: string) => void;
  onBrowse: () => void;
}

const ShopCartUi = ({ groups, token, chainName, onQuantity, onRemove, onLogin, onLogout, onCheckout, onBrowse }: ShopCartUiProps) => {
  const { t } = useTranslation('shopping-page');
  if (groups.length === 0)
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
    <div className='max-w-3xl space-y-10'>
      {groups.map(({ merchant, lines, total, account, hasAddress, hasUnpayable }) => (
        <section key={merchant.id} aria-label={t('cart.merchant-title', { merchant: merchant.name })}>
          <h2 className='text-lead font-medium'>{t('cart.merchant-title', { merchant: merchant.name })}</h2>
          <div className='mb-3 flex flex-wrap items-center gap-x-3 text-small text-muted-foreground'>
            <p>
              {account
                ? `${t('account.as', { name: account.name })} · ${account.shippingAddress ? t('account.ship-to', { address: account.shippingAddress }) : t('account.no-address')}`
                : t('account.not-logged-in')}
            </p>
            {account && (
              <Button type='button' variant='link' size='sm' onClick={() => onLogout(merchant.id)} className='h-auto px-0 font-normal text-muted-foreground underline'>
                {t('account.logout')}
              </Button>
            )}
          </div>
          <ul className='divide-y border' aria-label={t('cart.label')}>
            {lines.map(({ product, quantity, total: lineTotal, payable }) => (
              <li key={product.id} className='flex items-center gap-3 p-4'>
                <ShopProductThumbUi product={product} className='size-14' iconClassName='size-6' />
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-body font-medium'>{product.name}</p>
                  <p className='truncate text-small text-muted-foreground'>{product.merchant.name}</p>
                  {!payable && <p className='text-small text-destructive'>{t('cart.not-accepted', { chain: chainName })}</p>}
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
                  {quantity > 1 && <p className='text-small text-muted-foreground'>{t('cart.each', { price: formatPrice(product.price) })}</p>}
                </div>
                <Button type='button' variant='ghost' size='icon-sm' aria-label={t('cart.remove', { name: product.name })} onClick={() => onRemove(product.id)}>
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
          {account && !hasAddress && (
            <p role='alert' className='mt-3 text-small text-destructive'>
              {t('cart.no-address-error')}{' '}
              <a href={ECOMMERCE_ACCOUNT_URL} target='_blank' rel='noreferrer' className='underline'>
                {t('cart.no-address-link')}
              </a>
              .
            </p>
          )}
          {account ? (
            <Button className='mt-4' disabled={hasUnpayable || !hasAddress} onClick={() => onCheckout(merchant.id)}>
              {t('cart.checkout', { total: formatAtomic(total), token })}
            </Button>
          ) : (
            <div className='mt-4 flex flex-wrap gap-2'>
              <Button onClick={() => onLogin(merchant.id)}>{t('cart.login')}</Button>
              <Button disabled>{t('cart.checkout', { total: formatAtomic(total), token })}</Button>
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default ShopCartUi;
