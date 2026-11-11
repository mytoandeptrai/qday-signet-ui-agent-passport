import { FormInput } from '@/components/form-fields/form-input';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { useFormContext } from 'react-hook-form';
import type { LimitsFormData } from '../../hooks';

type SettingsLimitsFormUiProps = {
  isLoading?: boolean;
};

const SettingsLimitsFormUi = ({ isLoading = false }: SettingsLimitsFormUiProps) => {
  const { control } = useFormContext<LimitsFormData>();
  const { t } = useTranslation('settings-page');
  return (
    <div className='space-y-6'>
      <FormInput control={control} name='defaultLimit' type='number' step='any' label={t('limits.default-limit')} />
      <FormInput control={control} name='defaultPerCallLimit' type='number' step='any' label={t('limits.default-per-call')} />
      <FormInput control={control} name='requireApprovalAbove' type='number' step='any' label={t('limits.approval-above')} />
      <Button type='submit' disabled={isLoading}>
        {t('labels.save')}
      </Button>
    </div>
  );
};

export default SettingsLimitsFormUi;
