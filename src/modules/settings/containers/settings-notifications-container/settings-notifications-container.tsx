import { FormWrapper } from '@/components/ui/form';
import { SettingsNotificationsFormUi } from '../../components';
import { useSettingsNotificationsContainer } from '../../hooks';

const SettingsNotificationsContainer = () => {
  const { form, isLoading, onSubmit } = useSettingsNotificationsContainer();
  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <SettingsNotificationsFormUi isLoading={isLoading} />
    </FormWrapper>
  );
};

export default SettingsNotificationsContainer;
