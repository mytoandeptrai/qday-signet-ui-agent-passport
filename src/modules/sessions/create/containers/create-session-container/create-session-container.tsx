import { FormWrapper } from '@/components/ui/form';
import { CreateSessionFormUi, CreateSessionNeedsActivationUi } from '../../components';
import { useCreateSessionContainer } from '../../hooks';

const CreateSessionContainer = () => {
  const { form, available, agentNames, needsActivation, status, summary, isLoading, onActivate, onRegisterAgent, onSubmit } =
    useCreateSessionContainer();
  if (needsActivation) return <CreateSessionNeedsActivationUi onActivate={onActivate} />;
  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <CreateSessionFormUi
        available={available}
        agentNames={agentNames}
        status={status}
        summary={summary}
        isLoading={isLoading}
        onRegisterAgent={onRegisterAgent}
      />
    </FormWrapper>
  );
};

export default CreateSessionContainer;
