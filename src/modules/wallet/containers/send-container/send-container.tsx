import { FormWrapper } from '@/components/ui/form';
import { SendFormUi } from '../../components';
import { useSendContainer } from '../../hooks';

const SendContainer = () => {
  const { form, amount, available, status, summary, isLoading, onSubmit } = useSendContainer();
  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <SendFormUi amount={amount} available={available} status={status} summary={summary} isLoading={isLoading} />
    </FormWrapper>
  );
};

export default SendContainer;
