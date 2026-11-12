import { CreateSignetpassUi } from '../../components';
import { useCreateSignetPassContainer } from '../../hooks';

const CreateSignetpassContainer = () => {
  const { owner, signetPassAddress, network, status, summary, isLoading, onCreate } = useCreateSignetPassContainer();
  return (
    <CreateSignetpassUi
      owner={owner}
      signetPassAddress={signetPassAddress}
      network={network}
      status={status}
      summary={summary}
      isLoading={isLoading}
      onCreate={onCreate}
    />
  );
};

export default CreateSignetpassContainer;
