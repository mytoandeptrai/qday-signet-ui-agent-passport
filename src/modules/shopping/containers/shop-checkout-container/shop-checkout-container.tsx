import { ShopCheckoutUi } from '../../components';
import { useShopCheckoutContainer } from '../../hooks';

const ShopCheckoutContainer = () => {
  const checkout = useShopCheckoutContainer();
  return (
    <ShopCheckoutUi
      items={checkout.items}
      shops={checkout.shops}
      total={checkout.total}
      shipTo={checkout.shipTo}
      token={checkout.token}
      passReady={checkout.passReady}
      agents={checkout.agents}
      selectedAgent={checkout.selectedAgent}
      sessionIssue={checkout.sessionIssue}
      left={checkout.left}
      perCall={checkout.perCall}
      proposal={checkout.proposal}
      problem={checkout.problem}
      status={checkout.status}
      summary={checkout.summary}
      isLoading={checkout.isLoading}
      canPay={checkout.canPay}
      onSelectAgent={checkout.onSelectAgent}
      onCreateSession={checkout.onCreateSession}
      onRegisterAgent={checkout.onRegisterAgent}
      onPay={checkout.onPay}
    />
  );
};

export default ShopCheckoutContainer;
