import { FormNumberInput } from '@/components/form-fields/form-number-input';
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
      <FormNumberInput control={control} name='defaultLimit' label={t('limits.default-limit')} />
      <FormNumberInput control={control} name='defaultPerCallLimit' label={t('limits.default-per-call')} />
      <FormNumberInput control={control} name='requireApprovalAbove' label={t('limits.approval-above')} />
      <Button type='submit' disabled={isLoading}>
        {t('labels.save')}
      </Button>
    </div>
  );
};

export default SettingsLimitsFormUi;
