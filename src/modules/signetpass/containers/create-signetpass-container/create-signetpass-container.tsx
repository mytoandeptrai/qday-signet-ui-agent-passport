import { CreateSignetpassUi } from '../../components';
import { useCreateSignetPassContainer } from '../../hooks';

const CreateSignetpassContainer = () => {
  const { owner, signetPassAddress, network, status, isLoading, onCreate } = useCreateSignetPassContainer();
  return (
    <CreateSignetpassUi
      owner={owner}
      signetPassAddress={signetPassAddress}
      network={network}
      status={status}
      isLoading={isLoading}
      onCreate={onCreate}
    />
  );
};

export default CreateSignetpassContainer;
