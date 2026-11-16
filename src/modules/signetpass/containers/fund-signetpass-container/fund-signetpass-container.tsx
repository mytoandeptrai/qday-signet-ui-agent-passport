import { AddFundsCryptoUi, FundSignetpassTabsUi } from '../../components';
import { useFundSignetpassContainer } from '../../hooks';
import MoveFundsContainer from '../move-funds-container';

const FundSignetpassContainer = () => {
  const { t, tab, address, qr, network, onTabChange } = useFundSignetpassContainer();

  return (
    <div className='flex flex-col gap-5'>
      <FundSignetpassTabsUi tab={tab} onTabChange={onTabChange} />
      {tab === 'main' && <MoveFundsContainer />}
      {tab === 'receive' && (
        <AddFundsCryptoUi address={address} qr={qr} network={network} label={t('fund.receive.address')} />
      )}
    </div>
  );
};

export default FundSignetpassContainer;
