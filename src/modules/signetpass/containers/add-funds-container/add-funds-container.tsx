import { FormWrapper } from '@/components/ui/form';
import {
  AddFundsCryptoUi,
  AddFundsNeedsSignetpassUi,
  AddFundsTabsUi,
  AddFundsTransferUi,
} from '../../components';
import { useAddFundsContainer } from '../../hooks';

const AddFundsContainer = () => {
  const { tab, created, address, network, mainBalance, form, amount, status, isLoading, onTabChange, onCreateSignetPass, onSubmit } =
    useAddFundsContainer();

  if (!created) return <AddFundsNeedsSignetpassUi onCreate={onCreateSignetPass} />;

  return (
    <div className='flex flex-col gap-5'>
      <AddFundsTabsUi tab={tab} onTabChange={onTabChange} />
      {tab === 'crypto' && <AddFundsCryptoUi address={address} network={network} />}
      {tab === 'wallet' && (
        <FormWrapper form={form} onSubmit={onSubmit}>
          <AddFundsTransferUi mainBalance={mainBalance} amount={amount} status={status} isLoading={isLoading} />
        </FormWrapper>
      )}
    </div>
  );
};

export default AddFundsContainer;
