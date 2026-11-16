import { FormWrapper } from '@/components/ui/form';
import { CreateSignetpassUi } from '../../components';
import { useCreateSignetPassContainer } from '../../hooks';

const CreateSignetpassContainer = () => {
  const { owner, network, balance, fee, insufficient, form, status, summary, isLoading, onSubmit } = useCreateSignetPassContainer();
  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <CreateSignetpassUi owner={owner} network={network} balance={balance} fee={fee} insufficient={insufficient} status={status} summary={summary} isLoading={isLoading} />
    </FormWrapper>
  );
};

export default CreateSignetpassContainer;
