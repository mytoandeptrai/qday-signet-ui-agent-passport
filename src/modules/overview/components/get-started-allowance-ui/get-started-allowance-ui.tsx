import { FormInput } from '@/components/form-fields/form-input';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { useFormContext } from 'react-hook-form';
import type { AllowanceFormData } from '../../hooks';

const GetStartedAllowanceUi = () => {
  const { control } = useFormContext<AllowanceFormData>();
  const { t } = useTranslation('overview-page');
  return (
    <div className='max-w-md space-y-4'>
      <FormInput control={control} name='limit' type='number' step='any' label={t('allowance.limit')} />
      <FormInput control={control} name='perCall' type='number' step='any' label={t('allowance.per-call')} />
      <Button type='submit'>{t('allowance.save')}</Button>
    </div>
  );
};

export default GetStartedAllowanceUi;
