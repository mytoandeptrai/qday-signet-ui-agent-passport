import WalletGate from '@/components/ui/wallet-gate';
import { OverviewBalanceUi } from '../../components';
import { useOverviewBalanceContainer } from '../../hooks';

const OverviewBalanceContainer = () => {
  const { available, pass, passkeyEnabled, onCopyAddress, onAddFunds } = useOverviewBalanceContainer();
  return (
    <aside>
      <WalletGate>
        <OverviewBalanceUi available={available} pass={pass} passkeyEnabled={passkeyEnabled} onCopyAddress={onCopyAddress} onAddFunds={onAddFunds} />
      </WalletGate>
    </aside>
  );
};

export default OverviewBalanceContainer;
