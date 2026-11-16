import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import type { ShopOrder } from '@/types/passport';
import { ORDER_STEPS, formatPrice } from '../../utils';

interface ShopOrdersUiProps {
  orders: ShopOrder[];
  token: string;
  canShip: boolean;
  canDeliver: boolean;
  onShip: () => void;
  onDeliver: () => void;
  onClear: () => void;
}

const ShopOrdersUi = ({ orders, token, canShip, canDeliver, onShip, onDeliver, onClear }: ShopOrdersUiProps) => {
  const { t } = useTranslation('shopping-page');
  return (
    <div className='max-w-3xl'>
      {orders.length === 0 ? (
        <div className='border border-dashed py-14 text-center'>
          <p className='font-medium'>{t('orders.empty-title')}</p>
          <p className='mt-1 text-small text-muted-foreground'>{t('orders.empty-hint')}</p>
        </div>
      ) : (
        <ul className='space-y-4' aria-label={t('orders.label')}>
          {orders.map((order) => (
            <li key={order.id} className='border p-4'>
              <div className='flex items-center justify-between gap-3'>
                <span className='font-medium'>{order.id}</span>
                <span className='border px-2 py-0.5 text-small' data-testid='order-status'>
                  {t(`orders.status.${order.status}`)}
                </span>
              </div>
              <p className='text-small text-muted-foreground'>
                {new Date(order.createdAt).toLocaleString(undefined, {
                  day: 'numeric',
                  month: 'short',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
              <ol className='mt-3 grid grid-cols-3 gap-1' aria-label={t('orders.progress')}>
                {ORDER_STEPS.map((step, i) => {
                  const done = ORDER_STEPS.indexOf(order.status) >= i;
                  return (
                    <li key={step} className='space-y-1'>
                      <span className={cn('block h-0.5', done ? 'bg-foreground' : 'bg-border')} />
                      <span className={cn('block text-small', done ? 'text-foreground' : 'text-muted-foreground')}>
                        {t(`orders.status.${step}`)}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <ul className='mt-3 space-y-1 text-body'>
                {order.lines.map((line) => (
                  <li key={line.productId} className='flex justify-between gap-3'>
                    <span className='truncate'>
                      {line.quantity} × {line.name}
                    </span>
                    <span className='shrink-0 text-muted-foreground tabular-nums'>{formatPrice(line.price)}</span>
                  </li>
                ))}
              </ul>
              <dl className='mt-3 space-y-1 border-t pt-3 text-body'>
                <div className='flex justify-between gap-3'>
                  <dt className='text-muted-foreground'>{t('orders.paid-from')}</dt>
                  <dd className='truncate text-right'>{order.passId ? order.paidFrom : t('checkout.main-wallet')}</dd>
                </div>
                <div className='flex justify-between gap-3'>
                  <dt className='text-muted-foreground'>{t('orders.ship-to')}</dt>
                  <dd className='text-right'>{order.shipTo}</dd>
                </div>
                <div className='flex justify-between gap-3 font-medium'>
                  <dt>{t('orders.total')}</dt>
                  <dd className='tabular-nums'>
                    {order.total} {token}
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}
      {/* There is no merchant yet, so these stand in for one. */}
      <div className='mt-6 border border-dashed p-4'>
        <p className='text-small text-muted-foreground'>{t('orders.preview.note')}</p>
        <div className='mt-3 flex flex-wrap gap-2'>
          <Button variant='outline' disabled={!canShip} onClick={onShip}>
            {t('orders.preview.ship')}
          </Button>
          <Button variant='outline' disabled={!canDeliver} onClick={onDeliver}>
            {t('orders.preview.deliver')}
          </Button>
          <Button variant='ghost' onClick={onClear}>
            {t('orders.preview.clear')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShopOrdersUi;
