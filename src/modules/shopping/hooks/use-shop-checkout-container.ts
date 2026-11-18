import { useState } from 'react';
import { toast } from 'sonner';
import { useGetAgentList } from '@/apis/agents';
import { useGetSessionList } from '@/apis/sessions';
import { useGetSignetPasses } from '@/apis/signetpass';
import { useGetShop, usePlaceOrderMutation } from '@/apis/shopping';
import { useGetMainWallet } from '@/apis/wallet';
import { NETWORKS, ROUTES } from '@/constant';
import { useAppDialog } from '@/hooks/use-app-dialog';
import { useTranslation } from '@/integrations/i18n';
import { useSignAction } from '@/integrations/wallet';
import { useNavigate } from '@tanstack/react-router';
import type { CheckoutAgent } from '../components';
import { budgetLeft, cartCount, cartTotal, checkoutProblem, formatAtomic, pricedCart, proposedSession, sessionProblem } from '../utils';

/** Pays the cart from the spending session of an agent, signed in the wallet. An agent never pays from the Main Wallet. */
export const useShopCheckoutContainer = () => {
  const { t } = useTranslation('shopping-page');
  const { open, close } = useAppDialog();
  const navigate = useNavigate();
  const { data: shop } = useGetShop();
  const { data: mainWallet } = useGetMainWallet();
  const { data: passes } = useGetSignetPasses();
  const { data: agents = [] } = useGetAgentList();
  const { data: sessions = [] } = useGetSessionList();
  const placeOrder = usePlaceOrderMutation();
  const { status, summary, run } = useSignAction();
  const [chosen, setChosen] = useState<string>();

  const network = NETWORKS[mainWallet?.network ?? 'base'];
  const token = network.token.symbol;
  const cart = shop?.cart ?? [];
  const lines = pricedCart(cart, network.key);
  const atomicTotal = cartTotal(lines);
  const total = Number(formatAtomic(atomicTotal));
  const passReady = passes?.selected?.status === 'active';
  const nowMs = Date.now();

  // The agents of the selected SignetPass, each with the session that is still open for it.
  const agentRows: CheckoutAgent[] = agents
    .filter((a) => a.status === 'active')
    .map((a) => {
      const session = sessions.find((x) => x.agent === a.name && x.status === 'active' && Date.parse(x.expiresAt) > nowMs);
      return { name: a.name, task: session?.task, left: session ? budgetLeft(session) : undefined, perCall: session?.perCallLimit };
    });
  // Until the shopper picks one, the first agent pays.
  const agent = agentRows.find((a) => a.name === chosen) ?? agentRows[0];
  const session = sessions.find((x) => x.agent === agent?.name && x.status === 'active');

  const cartProblem = checkoutProblem(cart, network.key, Number.POSITIVE_INFINITY);
  const sessionIssue = !agent ? null : !session ? 'expired' : sessionProblem(session, total, nowMs);
  const account = shop?.account;
  const hasAddress = !!account?.shippingAddress;
  const canPay = hasAddress && passReady && !!agent && !!session && !cartProblem && !sessionIssue;

  const onPay = async () => {
    if (!canPay || !session) return;
    let orderId = '';
    const ok = await run(
      {
        kind: 'shop-checkout',
        summary: t('checkout.summary', { total: formatAtomic(atomicTotal), token, account: session.agent }),
      },
      async () => {
        orderId = (await placeOrder.mutateAsync({ sessionId: session.id })).id;
      }
    );
    if (!ok) return;
    toast.success(t('checkout.toasts.paid', { id: orderId }));
    close();
  };

  const proposal = proposedSession(total);

  return {
    t,
    items: cartCount(cart),
    shops: new Set(lines.map((l) => l.product.merchant.id)).size,
    total: formatAtomic(atomicTotal),
    shipTo: hasAddress ? `${account?.name} · ${account?.shippingAddress}` : undefined,
    token,
    passReady,
    agents: agentRows,
    selectedAgent: agent?.name,
    // 'expired' and a missing session read the same to the shopper: there is no session to pay with.
    sessionIssue,
    left: session ? budgetLeft(session) : 0,
    perCall: session?.perCallLimit ?? 0,
    proposal,
    problem: cartProblem,
    status,
    summary,
    isLoading: status === 'waiting' || placeOrder.isPending,
    canPay,
    onSelectAgent: setChosen,
    onCreateSession: () =>
      open('create-session', { agent: agent?.name, task: t('checkout.session-task'), limit: proposal.limit, perCall: proposal.perCall, hours: proposal.hours }),
    onRegisterAgent: () => navigate({ to: ROUTES.AGENTS }),
    onPay,
  };
};
