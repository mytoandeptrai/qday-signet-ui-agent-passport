import { FormWrapper } from '@/components/ui/form';
import { SendFormUi } from '../../components';
import { useSendContainer } from '../../hooks';

const SendContainer = () => {
  const { form, amount, available, status, isLoading, onSubmit } = useSendContainer();
  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <SendFormUi amount={amount} available={available} status={status} isLoading={isLoading} />
    </FormWrapper>
  );
};

export default SendContainer;
