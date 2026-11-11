import { FormSwitch } from '@/components/form-fields/form-switch';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { useFormContext } from 'react-hook-form';
import { NOTIFICATION_FIELDS, type NotificationsFormData } from '../../hooks';

type SettingsNotificationsFormUiProps = {
  isLoading?: boolean;
};

const SettingsNotificationsFormUi = ({ isLoading = false }: SettingsNotificationsFormUiProps) => {
  const { control } = useFormContext<NotificationsFormData>();
  const { t } = useTranslation('settings-page');
  return (
    <div className='space-y-5'>
      {NOTIFICATION_FIELDS.map((name) => (
        <FormSwitch key={name} control={control} name={name} label={t(`notifications.${name}.title`)} description={t(`notifications.${name}.description`)} />
      ))}
      <Button type='submit' disabled={isLoading}>
        {t('labels.save')}
      </Button>
    </div>
  );
};

export default SettingsNotificationsFormUi;
