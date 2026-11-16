import { mockDelay } from '@/lib/mock-delay';
import { currentMainWallet, visibleOrders, visiblePasses } from '@/stores/passport-store';
import { mockRequest } from '../mock-transport';
import type { PayAccount, PlaceOrderParams, SetCartQuantityParams, SetOrderStatusParams } from './types';

/** The cart, the orders of the connected account on this network, and the accounts that can pay. */
export const getShop = () =>
  mockRequest((s) => {
    const wallet = currentMainWallet(s);
    const accounts: PayAccount[] = [
      ...(wallet ? [{ id: 'wallet', name: 'Main Wallet', kind: 'wallet' as const, balance: wallet.balance }] : []),
      ...visiblePasses(s)
        .filter((p) => p.status === 'active')
        .map((p) => ({ id: p.id, name: p.name, kind: 'signetpass' as const, balance: p.balance.available })),
    ];
    return { cart: s.cart, orders: visibleOrders(s), accounts };
  });

export const addToCart = (productId: string) => mockRequest((s) => s.addToCart(productId));

export const setCartQuantity = ({ productId, quantity }: SetCartQuantityParams) =>
  mockRequest((s) => s.setCartQuantity(productId, quantity));

export const removeFromCart = (productId: string) => mockRequest((s) => s.removeFromCart(productId));

export const placeOrder = async ({ payFrom }: PlaceOrderParams) => {
  await mockDelay();
  return mockRequest((s) => s.placeOrder({ payFrom }));
};

export const setOrderStatus = ({ id, from, to }: SetOrderStatusParams) =>
  mockRequest((s) => s.setOrderStatus(id, from, to));

export const clearShop = () => mockRequest((s) => s.clearShop());
