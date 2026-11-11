import { PageHeader } from '@/components/app/page-header';
import { FormWrapper } from '@/components/ui/form';
import { VoucherListUi, VoucherRedeemFormUi } from '../../components';
import { useVouchersContainer } from '../../hooks';

const VouchersContainer = () => {
  const { t, form, vouchers, isLoading, onSubmit, onRedeemListed } = useVouchersContainer();
  return (
    <div className='max-w-2xl'>
      <PageHeader title={t('title')} description={t('description')} />
      <FormWrapper form={form} onSubmit={onSubmit}>
        <VoucherRedeemFormUi isLoading={isLoading} />
      </FormWrapper>
      <VoucherListUi vouchers={vouchers} onRedeem={onRedeemListed} />
    </div>
  );
};

export default VouchersContainer;
