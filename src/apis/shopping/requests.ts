import { mockDelay } from '@/lib/mock-delay';
import { visibleOrders } from '@/stores/passport-store';
import { mockRequest } from '../mock-transport';
import type { PlaceOrderParams, SetCartQuantityParams, SetOrderStatusParams } from './types';

/** The cart and the orders of the connected account on this network. */
export const getShop = () => mockRequest((s) => ({ cart: s.cart, orders: visibleOrders(s) }));

export const addToCart = (productId: string) => mockRequest((s) => s.addToCart(productId));

export const setCartQuantity = ({ productId, quantity }: SetCartQuantityParams) =>
  mockRequest((s) => s.setCartQuantity(productId, quantity));

export const removeFromCart = (productId: string) => mockRequest((s) => s.removeFromCart(productId));

export const placeOrder = async ({ sessionId }: PlaceOrderParams) => {
  await mockDelay();
  return mockRequest((s) => s.placeOrder({ sessionId }));
};

export const setOrderStatus = ({ id, from, to }: SetOrderStatusParams) =>
  mockRequest((s) => s.setOrderStatus(id, from, to));

export const clearShop = () => mockRequest((s) => s.clearShop());
