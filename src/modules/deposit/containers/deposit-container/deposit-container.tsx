import { PageHeader } from '@/components/app/page-header';
import { FormWrapper } from '@/components/ui/form';
import { DepositAmountFormUi, DepositCryptoUi, DepositMethodTabsUi } from '../../components';
import { useDepositContainer } from '../../hooks';
import DepositHistoryContainer from '../deposit-history-container';

const DepositContainer = () => {
  const { t, method, form, amount, walletAddress, isLoading, onMethodChange, onPickPreset, onSubmit, onCopyAddress } = useDepositContainer();
  return (
    <div className='max-w-2xl'>
      <PageHeader title={t('title')} description={t('description')} />
      <DepositMethodTabsUi method={method} onMethodChange={onMethodChange} />
      {method === 'crypto' ? (
        <DepositCryptoUi address={walletAddress} onCopyAddress={onCopyAddress} />
      ) : (
        <FormWrapper form={form} onSubmit={onSubmit}>
          <DepositAmountFormUi amount={amount} isLoading={isLoading} onPickPreset={onPickPreset} />
        </FormWrapper>
      )}
      <DepositHistoryContainer />
    </div>
  );
};

export default DepositContainer;
