import { FormNumberInput } from '@/components/form-fields/form-number-input';
import SignStatusUi from '@/components/ui/sign-status';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import type { SignStatus } from '@/integrations/wallet';
import { money } from '@/lib/format';
import { useFormContext } from 'react-hook-form';
import type { TransferFormData } from '../../hooks';

interface AddFundsTransferUiProps {
  mainBalance: number;
  amount: number;
  status: SignStatus;
  isLoading: boolean;
}

const AddFundsTransferUi = ({ mainBalance, amount, status, isLoading }: AddFundsTransferUiProps) => {
  const { t } = useTranslation('signetpass-page');
  const { control } = useFormContext<TransferFormData>();
  return (
    <div className='flex flex-col gap-4'>
      <p className='text-small text-muted-foreground'>{t('add-funds.transfer.available', { amount: money(mainBalance) })}</p>
      <FormNumberInput control={control} name='amount' label={t('add-funds.transfer.amount')} disabled={isLoading} />
      <SignStatusUi status={status} />
      <Button type='submit' disabled={isLoading || amount <= 0}>
        {isLoading ? t('add-funds.transfer.transferring') : t('add-funds.transfer.submit', { amount: money(amount) })}
      </Button>
    </div>
  );
};

export default AddFundsTransferUi;
