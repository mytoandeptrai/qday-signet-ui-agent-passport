import { FormWrapper } from '@/components/ui/form';
import { CreateSessionFormUi, CreateSessionNeedsActivationUi } from '../../components';
import { useCreateSessionContainer } from '../../hooks';

const CreateSessionContainer = () => {
  const { form, available, needsActivation, status, summary, isLoading, onActivate, onSubmit } = useCreateSessionContainer();
  if (needsActivation) return <CreateSessionNeedsActivationUi onActivate={onActivate} />;
  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <CreateSessionFormUi available={available} status={status} summary={summary} isLoading={isLoading} />
    </FormWrapper>
  );
};

export default CreateSessionContainer;
