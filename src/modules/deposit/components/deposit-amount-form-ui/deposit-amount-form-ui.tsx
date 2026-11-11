import { FormInput } from '@/components/form-fields/form-input';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { money } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { type DepositFormData, PRESETS } from '../../hooks';

type DepositAmountFormUiProps = {
  amount: number;
  isLoading?: boolean;
  onPickPreset: (value: number) => void;
};

const DepositAmountFormUi = ({ amount, isLoading = false, onPickPreset }: DepositAmountFormUiProps) => {
  const { control } = useFormContext<DepositFormData>();
  const { t } = useTranslation('deposit-page');
  return (
    <div className='mt-6'>
      <p className='mb-2 text-body font-medium'>{t('fields.amount.label')}</p>
      <div className='mb-3 flex gap-2'>
        {PRESETS.map((p) => (
          <button
            key={p}
            type='button'
            onClick={() => onPickPreset(p)}
            className={cn('border px-3 py-2 text-body tabular-nums', amount === p && 'border-brand')}
          >
            ${p}
          </button>
        ))}
      </div>
      <FormInput control={control} name='amount' type='number' step='any' disabled={isLoading} />
      <Button type='submit' disabled={isLoading} className='mt-5'>
        {isLoading ? t('labels.processing') : t('labels.deposit', { amount: money(amount) })}
      </Button>
    </div>
  );
};

export default DepositAmountFormUi;
