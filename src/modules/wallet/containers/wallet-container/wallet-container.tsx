import { PageHeader } from '@/components/ui/page-header';
import WalletGate from '@/components/ui/wallet-gate';
import { WalletBalanceUi, WalletNetworksUi, WalletTransactionsUi } from '../../components';
import { useWalletContainer } from '../../hooks';

const WalletContainer = () => {
  const { t, balance, transactions, onSend, onReceive } = useWalletContainer();
  return (
    <div className='max-w-3xl'>
      <PageHeader title={t('title')} description={t('description')} />
      <WalletGate>
        <WalletBalanceUi balance={balance} onSend={onSend} onReceive={onReceive} />
        <WalletNetworksUi />
        <WalletTransactionsUi transactions={transactions} />
      </WalletGate>
    </div>
  );
};

export default WalletContainer;
