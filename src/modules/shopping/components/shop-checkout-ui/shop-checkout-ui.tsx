import SignStatusUi from '@/components/ui/sign-status';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from '@/integrations/i18n';
import type { SignStatus } from '@/integrations/wallet';
import { money } from '@/lib/format';
import type { PayAccount } from '@/apis/shopping';
import { type CheckoutProblem, SAMPLE_SHIP_TO } from '../../utils';

export interface CheckoutAccount extends PayAccount {
  /** The balance does not cover the cart. */
  short: boolean;
}

interface ShopCheckoutUiProps {
  items: number;
  shops: number;
  total: string;
  token: string;
  accounts: CheckoutAccount[];
  selectedId?: string;
  problem: CheckoutProblem | null;
  status: SignStatus;
  summary?: string;
  isLoading: boolean;
  onSelect: (id: string) => void;
  onPay: () => void;
}

const ShopCheckoutUi = ({
  items,
  shops,
  total,
  token,
  accounts,
  selectedId,
  problem,
  status,
  summary,
  isLoading,
  onSelect,
  onPay,
}: ShopCheckoutUiProps) => {
  const { t } = useTranslation('shopping-page');
  return (
    <div className='flex flex-col gap-4'>
      <p className='text-small text-muted-foreground'>
        {t('checkout.items', { count: items })} · {t('checkout.shops', { count: shops })}
      </p>
      <dl className='divide-y border text-body'>
        <div className='flex items-center justify-between px-4 py-3'>
          <dt className='text-muted-foreground'>{t('checkout.total')}</dt>
          <dd className='font-medium tabular-nums'>
            {total} {token}
          </dd>
        </div>
        <div className='flex items-center justify-between gap-3 px-4 py-3'>
          <dt className='text-muted-foreground'>{t('checkout.ship-to')}</dt>
          <dd className='text-right'>{SAMPLE_SHIP_TO}</dd>
        </div>
      </dl>
      <fieldset disabled={isLoading} className='min-w-0'>
        <legend className='mb-2 text-body font-medium'>{t('checkout.pay-from')}</legend>
        <RadioGroup value={selectedId} onValueChange={onSelect} className='gap-2'>
          {accounts.map((a) => (
            <Label
              key={a.id}
              htmlFor={`pay-${a.id}`}
              className='flex cursor-pointer items-center gap-3 border px-4 py-3 font-normal'
            >
              <RadioGroupItem id={`pay-${a.id}`} value={a.id} />
              <span className='min-w-0 flex-1'>
                <span className='block truncate font-medium'>
                  {a.kind === 'wallet' ? t('checkout.main-wallet') : a.name}
                </span>
                <span className='block text-small text-muted-foreground'>
                  {a.kind === 'wallet' ? t('checkout.kind-wallet') : t('checkout.kind-signetpass')}
                </span>
              </span>
              <span className='text-right'>
                <span className='block tabular-nums'>
                  {money(a.balance)} {token}
                </span>
                {a.short && <span className='block text-small text-destructive'>{t('checkout.short')}</span>}
              </span>
            </Label>
          ))}
        </RadioGroup>
      </fieldset>
      {problem && (
        <p role='alert' className='text-small text-destructive'>
          {t(`checkout.problems.${problem.code}`, {
            name: 'name' in problem ? problem.name : '',
            max: 'max' in problem ? problem.max : 0,
            token,
          })}
        </p>
      )}
      <SignStatusUi status={status} summary={summary} />
      <Button type='button' disabled={isLoading || problem !== null} onClick={onPay}>
        {isLoading ? t('checkout.paying') : t('checkout.submit', { total, token })}
      </Button>
    </div>
  );
};

export default ShopCheckoutUi;
