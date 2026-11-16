import { ShopCheckoutUi } from '../../components';
import { useShopCheckoutContainer } from '../../hooks';

const ShopCheckoutContainer = () => {
  const { items, shops, total, token, accounts, selectedId, problem, status, summary, isLoading, onSelect, onPay } =
    useShopCheckoutContainer();
  return (
    <ShopCheckoutUi
      items={items}
      shops={shops}
      total={total}
      token={token}
      accounts={accounts}
      selectedId={selectedId}
      problem={problem}
      status={status}
      summary={summary}
      isLoading={isLoading}
      onSelect={onSelect}
      onPay={onPay}
    />
  );
};

export default ShopCheckoutContainer;
