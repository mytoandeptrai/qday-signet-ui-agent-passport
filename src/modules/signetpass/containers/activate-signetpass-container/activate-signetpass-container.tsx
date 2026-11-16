import { ActivateSignetpassUi } from '../../components';
import { useActivateSignetPassContainer } from '../../hooks';

const ActivateSignetpassContainer = () => {
  const { pass, network, isLoading, onActivate } = useActivateSignetPassContainer();
  if (!pass) return null;

  return (
    <ActivateSignetpassUi
      name={pass.name}
      network={network}
      isLoading={isLoading}
      onActivate={onActivate}
    />
  );
};

export default ActivateSignetpassContainer;
