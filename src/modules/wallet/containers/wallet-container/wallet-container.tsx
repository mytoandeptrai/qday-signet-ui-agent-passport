import { PageHeader } from '@/components/ui/page-header';
import WalletGate from '@/components/ui/wallet-gate';
import { WalletBalanceUi, WalletNetworkPickerUi, WalletSignetpassesUi, WalletTokensUi, WalletTransactionsUi } from '../../components';
import { useWalletContainer } from '../../hooks';

const WalletContainer = () => {
  const {
    t,
    network,
    address,
    isConnected,
    isUnsupported,
    switchingTo,
    tokens,
    selected,
    hidden,
    transactions,
    signetPasses,
    onSwitchNetwork,
    onSelectToken,
    onToggleHidden,
    onSend,
    onReceive,
    onCreateSignetPass,
  } = useWalletContainer();
  return (
    <div className='max-w-3xl'>
      <PageHeader title={t('title')} description={t('description')} />
      <WalletGate>
        <WalletNetworkPickerUi
          active={network.key}
          isConnected={isConnected}
          isUnsupported={isUnsupported}
          switchingTo={switchingTo}
          onSwitch={onSwitchNetwork}
        />
        <WalletBalanceUi
          chainName={network.name}
          networkName={network.testnetName}
          address={address}
          symbol={selected.symbol}
          amount={selected.amount}
          hidden={hidden}
          canSend={selected.id === 'stable'}
          onToggleHidden={onToggleHidden}
          onSend={onSend}
          onReceive={onReceive}
        />
        <WalletTokensUi tokens={tokens} selected={selected.id} hidden={hidden} onSelect={onSelectToken} />
        <WalletSignetpassesUi passes={signetPasses} network={network} onCreate={onCreateSignetPass} />
        <WalletTransactionsUi transactions={transactions} symbol={network.token.symbol} />
      </WalletGate>
    </div>
  );
};

export default WalletContainer;
