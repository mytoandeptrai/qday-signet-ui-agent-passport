import { FormWrapper } from '@/components/ui/form';
import {
  AddFundsCardUi,
  AddFundsCryptoUi,
  AddFundsNeedsSignetpassUi,
  AddFundsTabsUi,
  AddFundsTransferUi,
} from '../../components';
import { useAddFundsContainer } from '../../hooks';

const AddFundsContainer = () => {
  const {
    tab,
    created,
    address,
    network,
    mainBalance,
    form,
    amount,
    status,
    summary,
    isLoading,
    onTabChange,
    onCreateSignetPass,
    onSubmit,
    cardEnabled,
    cardNetwork,
    onCardNetwork,
    isCardOpening,
    isSwitchingToCard,
    onSwitchToCardNetwork,
    onBuyWithCard,
  } = useAddFundsContainer();

  if (!created) return <AddFundsNeedsSignetpassUi onCreate={onCreateSignetPass} />;

  return (
    <div className='flex flex-col gap-5'>
      <AddFundsTabsUi tab={tab} onTabChange={onTabChange} cardEnabled={cardEnabled} />
      {tab === 'crypto' && <AddFundsCryptoUi address={address} network={network} />}
      {tab === 'wallet' && (
        <FormWrapper form={form} onSubmit={onSubmit}>
          <AddFundsTransferUi mainBalance={mainBalance} amount={amount} status={status} summary={summary} isLoading={isLoading} />
        </FormWrapper>
      )}
      {tab === 'card' && cardEnabled && (
        <AddFundsCardUi
          address={address}
          network={cardNetwork}
          onNetwork={onCardNetwork}
          isOpening={isCardOpening}
          isSwitching={isSwitchingToCard}
          onSwitchNetwork={onSwitchToCardNetwork}
          onContinue={onBuyWithCard}
        />
      )}
    </div>
  );
};

export default AddFundsContainer;
