import { FormWrapper } from '@/components/ui/form';
import { ShopLoginUi } from '../../components';
import { useShopLoginContainer } from '../../hooks';

const ShopLoginContainer = () => {
  const login = useShopLoginContainer();
  return (
    <FormWrapper form={login.form} onSubmit={login.onSubmit}>
      <ShopLoginUi merchantName={login.merchantName} isLoading={login.isLoading} />
    </FormWrapper>
  );
};

export default ShopLoginContainer;
