import { FormInput } from '@/components/form-fields/form-input';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { useFormContext } from 'react-hook-form';
import type { VoucherFormData } from '../../hooks';

type VoucherRedeemFormUiProps = {
  isLoading?: boolean;
};

const VoucherRedeemFormUi = ({ isLoading = false }: VoucherRedeemFormUiProps) => {
  const { control } = useFormContext<VoucherFormData>();
  const { t } = useTranslation('vouchers-page');
  return (
    <div className='flex items-start gap-2'>
      <FormInput
        control={control}
        name='code'
        label={t('fields.code.label')}
        placeholder={t('fields.code.placeholder')}
        inputClassName='font-mono uppercase'
        className='flex-1'
        disabled={isLoading}
      />
      <Button type='submit' disabled={isLoading} className='mt-[1.625rem]'>
        {t('labels.redeem')}
      </Button>
    </div>
  );
};

export default VoucherRedeemFormUi;
