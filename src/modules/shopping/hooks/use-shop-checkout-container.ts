import { useState } from 'react';
import { toast } from 'sonner';
import { useGetShop, usePlaceOrderMutation } from '@/apis/shopping';
import { useGetMainWallet } from '@/apis/wallet';
import { NETWORKS } from '@/constant';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { useSignAction } from '@/integrations/wallet';
import type { CheckoutAccount } from '../components';
import { cartCount, cartTotal, checkoutProblem, formatAtomic, pricedCart } from '../utils';

/** Pays the cart from the Main Wallet or an active SignetPass, signed in MetaMask. */
export const useShopCheckoutContainer = () => {
  const { t } = useTranslation('shopping-page');
  const { close } = useAppDialog();
  const { data: shop } = useGetShop();
  const { data: mainWallet } = useGetMainWallet();
  const placeOrder = usePlaceOrderMutation();
  const { status, summary, run } = useSignAction();
  const [chosen, setChosen] = useState<string>();

  const network = NETWORKS[mainWallet?.network ?? 'base'];
  const token = network.token.symbol;
  const cart = shop?.cart ?? [];
  const lines = pricedCart(cart, network.key);
  const total = cartTotal(lines);
  // Until the shopper picks one, the Main Wallet pays.
  const account = shop?.accounts.find((a) => a.id === chosen) ?? shop?.accounts[0];
  const accounts: CheckoutAccount[] = (shop?.accounts ?? []).map((a) => ({
    ...a,
    short: checkoutProblem(cart, network.key, a.balance)?.code === 'balance',
  }));
  const problem = account ? checkoutProblem(cart, network.key, account.balance) : { code: 'empty' as const };

  const onPay = async () => {
    if (!account || problem) return;
    let orderId = '';
    const ok = await run(
      {
        kind: 'shop-checkout',
        summary: t('checkout.summary', { total: formatAtomic(total), token, account: account.name }),
      },
      async () => {
        orderId = (await placeOrder.mutateAsync({ payFrom: account.id })).id;
      }
    );
    if (!ok) return;
    toast.success(t('checkout.toasts.paid', { id: orderId }));
    close();
  };

  return {
    t,
    items: cartCount(cart),
    shops: new Set(lines.map((l) => l.product.merchant.id)).size,
    total: formatAtomic(total),
    token,
    accounts,
    selectedId: account?.id,
    problem,
    status,
    summary,
    isLoading: status === 'waiting' || placeOrder.isPending,
    onSelect: setChosen,
    onPay,
  };
};
