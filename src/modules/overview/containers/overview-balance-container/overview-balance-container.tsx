import WalletGate from '@/components/app/wallet-gate';
import { OverviewAllowanceMeterUi, OverviewBalanceUi } from '../../components';
import { useOverviewBalanceContainer } from '../../hooks';

type OverviewBalanceContainerProps = {
  onEditAllowance: () => void;
};

const OverviewBalanceContainer = ({ onEditAllowance }: OverviewBalanceContainerProps) => {
  const { available, walletAddress, allowanceConfigured, defaultLimit, activeLimit, activeSpent, onCopyAddress, onAddFunds } = useOverviewBalanceContainer();
  return (
    <aside>
      <WalletGate>
        <OverviewBalanceUi available={available} walletAddress={walletAddress} onCopyAddress={onCopyAddress} onAddFunds={onAddFunds} />
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
