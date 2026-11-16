import { ReceiveUi } from '../../components';
import { useReceiveContainer } from '../../hooks';

const ReceiveContainer = () => {
  const { address, qr, network } = useReceiveContainer();
  return <ReceiveUi address={address} qr={qr} network={network} />;
};

export default ReceiveContainer;
