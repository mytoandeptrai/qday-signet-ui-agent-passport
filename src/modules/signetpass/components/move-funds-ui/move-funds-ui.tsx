import { FormNumberInput } from '@/components/form-fields/form-number-input';
import SignStatusUi from '@/components/ui/sign-status';
import { Button } from '@/components/ui/button';
import type { NetworkConfig } from '@/constant';
import { useTranslation } from '@/integrations/i18n';
import type { SignStatus } from '@/integrations/wallet';
import { money } from '@/lib/format';
import { useFormContext } from 'react-hook-form';
import type { TransferFormData } from '../../hooks';

interface MoveFundsUiProps {
  passName?: string;
  network: NetworkConfig;
  mainBalance: number;
  amount: number;
  status: SignStatus;
  summary?: string;
  isLoading: boolean;
}

const MoveFundsUi = ({ passName, network, mainBalance, amount, status, summary, isLoading }: MoveFundsUiProps) => {
  const { t } = useTranslation('signetpass-page');
  const { control } = useFormContext<TransferFormData>();
  return (
    <div className='flex flex-col gap-4'>
      <dl className='divide-y rounded-md border text-body'>
        <div className='flex items-center justify-between px-4 py-3'>
          <dt className='text-muted-foreground'>{t('move-funds.from')}</dt>
          <dd>{t('move-funds.main-wallet')}</dd>
        </div>
        <div className='flex items-center justify-between px-4 py-3'>
          <dt className='text-muted-foreground'>{t('move-funds.to')}</dt>
          <dd className='truncate'>{passName}</dd>
        </div>
        <div className='flex items-center justify-between px-4 py-3'>
          <dt className='text-muted-foreground'>{t('move-funds.available')}</dt>
          <dd className='tabular-nums'>
            {money(mainBalance)} {network.token.symbol}
          </dd>
        </div>
      </dl>
      <FormNumberInput control={control} name='amount' label={t('move-funds.amount', { token: network.token.symbol })} disabled={isLoading} />
      <SignStatusUi status={status} summary={summary} />
      <Button type='submit' disabled={isLoading || amount <= 0}>
        {isLoading ? t('move-funds.transferring') : t('move-funds.submit', { amount: money(amount) })}
      </Button>
    </div>
  );
};

export default MoveFundsUi;
