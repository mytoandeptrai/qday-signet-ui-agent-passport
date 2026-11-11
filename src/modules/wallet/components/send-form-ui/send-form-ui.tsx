import { FormInput } from '@/components/form-fields/form-input';
import SignStatusUi from '@/components/app/sign-status';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import type { SignStatus } from '@/integrations/wallet';
import { money } from '@/lib/format';
import { useFormContext } from 'react-hook-form';
import type { SendFormData } from '../../hooks';

interface SendFormUiProps {
  amount: number;
  available: number;
  status: SignStatus;
  isLoading: boolean;
}

const SendFormUi = ({ amount, available, status, isLoading }: SendFormUiProps) => {
  const { t } = useTranslation('wallet-page');
  const { control } = useFormContext<SendFormData>();
  return (
    <div className='flex flex-col gap-4'>
      <FormInput
        control={control}
        name='to'
        label={t('send.fields.to.label')}
        placeholder={t('send.fields.to.placeholder')}
        disabled={isLoading}
      />
      <FormInput control={control} name='amount' type='number' step='any' label={t('send.fields.amount.label')} disabled={isLoading} />
      <p className='text-small text-muted-foreground'>{t('send.available', { amount: money(available) })}</p>
      <SignStatusUi status={status} />
      <Button type='submit' disabled={isLoading || amount <= 0}>
        {isLoading ? t('send.sending') : t('send.submit', { amount: money(amount) })}
      </Button>
    </div>
  );
};

export default SendFormUi;
