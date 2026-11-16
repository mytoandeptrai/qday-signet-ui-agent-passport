import WalletGate from '@/components/ui/wallet-gate';
import { OverviewBalanceUi } from '../../components';
import { useOverviewBalanceContainer } from '../../hooks';

const OverviewBalanceContainer = () => {
  const { balance, network, address, passkeyEnabled, onCopyAddress, onAddFunds } = useOverviewBalanceContainer();
  return (
    <section className='border-b pb-8'>
      <WalletGate>
        <OverviewBalanceUi balance={balance} network={network} address={address} passkeyEnabled={passkeyEnabled} onCopyAddress={onCopyAddress} onAddFunds={onAddFunds} />
      </WalletGate>
    </section>
  );
};

export default OverviewBalanceContainer;
