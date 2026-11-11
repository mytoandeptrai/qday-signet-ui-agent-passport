import { ReceiveUi } from '../../components';
import { useReceiveContainer } from '../../hooks';

const ReceiveContainer = () => {
  const { address, qr } = useReceiveContainer();
  return <ReceiveUi address={address} qr={qr} />;
};

export default ReceiveContainer;
