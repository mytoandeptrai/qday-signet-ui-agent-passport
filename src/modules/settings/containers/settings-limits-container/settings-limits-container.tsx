import { FormWrapper } from '@/components/ui/form';
import { SettingsLimitsFormUi } from '../../components';
import { useSettingsLimitsContainer } from '../../hooks';

const SettingsLimitsContainer = () => {
  const { form, isLoading, onSubmit } = useSettingsLimitsContainer();
  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <SettingsLimitsFormUi isLoading={isLoading} />
    </FormWrapper>
  );
};

export default SettingsLimitsContainer;
