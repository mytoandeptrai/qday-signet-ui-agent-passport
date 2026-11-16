import { AddFundsCryptoUi, AddFundsTabsUi } from '../../components';
import { useAddFundsContainer } from '../../hooks';

const AddFundsContainer = () => {
  const { tab, address, network, onTabChange } = useAddFundsContainer();

  return (
    <div className='flex flex-col gap-5'>
      <AddFundsTabsUi tab={tab} onTabChange={onTabChange} />
      {tab === 'crypto' && <AddFundsCryptoUi address={address} network={network} />}
    </div>
  );
};

export default AddFundsContainer;
