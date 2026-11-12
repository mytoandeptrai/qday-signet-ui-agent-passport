import WalletGate from '@/components/ui/wallet-gate';
import { OverviewAllowanceMeterUi, OverviewBalanceUi } from '../../components';
import { useOverviewBalanceContainer } from '../../hooks';

type OverviewBalanceContainerProps = {
  onEditAllowance: () => void;
};

const OverviewBalanceContainer = ({ onEditAllowance }: OverviewBalanceContainerProps) => {
  const { available, pass, allowanceConfigured, defaultLimit, activeLimit, activeSpent, onCopyAddress, onAddFunds } = useOverviewBalanceContainer();
  return (
    <aside>
      <WalletGate>
        <OverviewBalanceUi available={available} pass={pass} onCopyAddress={onCopyAddress} onAddFunds={onAddFunds} />
        <OverviewAllowanceMeterUi
          configured={allowanceConfigured}
          spent={activeSpent}
          held={activeLimit}
          defaultLimit={defaultLimit}
          onEdit={onEditAllowance}
        />
      </WalletGate>
    </aside>
  );
};

export default OverviewBalanceContainer;
