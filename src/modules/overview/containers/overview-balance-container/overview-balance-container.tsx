import { OverviewAllowanceMeterUi, OverviewBalanceUi } from '../../components';
import { useOverviewBalanceContainer } from '../../hooks';

type OverviewBalanceContainerProps = {
  onEditAllowance: () => void;
};

const OverviewBalanceContainer = ({ onEditAllowance }: OverviewBalanceContainerProps) => {
  const { available, walletAddress, allowanceConfigured, defaultLimit, activeLimit, activeSpent, onCopyAddress } = useOverviewBalanceContainer();
  return (
    <aside>
      <OverviewBalanceUi available={available} walletAddress={walletAddress} onCopyAddress={onCopyAddress} />
      <OverviewAllowanceMeterUi
        configured={allowanceConfigured}
        spent={activeSpent}
        held={activeLimit}
        defaultLimit={defaultLimit}
        onEdit={onEditAllowance}
      />
    </aside>
  );
};

export default OverviewBalanceContainer;
