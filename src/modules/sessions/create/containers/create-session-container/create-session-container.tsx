import { FormWrapper } from '@/components/ui/form';
import { CreateSessionFormUi } from '../../components';
import { useCreateSessionContainer } from '../../hooks';

const CreateSessionContainer = () => {
  const { form, available, status, summary, isLoading, onSubmit } = useCreateSessionContainer();
  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <CreateSessionFormUi available={available} status={status} summary={summary} isLoading={isLoading} />
    </FormWrapper>
  );
};

export default CreateSessionContainer;
