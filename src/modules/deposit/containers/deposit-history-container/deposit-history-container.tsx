import { DepositHistoryUi } from '../../components';
import { useDepositHistoryContainer } from '../../hooks';

const DepositHistoryContainer = () => {
  const { deposits } = useDepositHistoryContainer();
  return <DepositHistoryUi deposits={deposits} />;
};

export default DepositHistoryContainer;
