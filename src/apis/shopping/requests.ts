import { mockDelay } from '@/lib/mock-delay';
import { currentEcommerceAccount, visibleOrders } from '@/stores/passport-store';
import { mockRequest } from '../mock-transport';
import type { LoginEcommerceParams, PlaceOrderParams, SetCartQuantityParams, SetOrderStatusParams } from './types';

export const getShop = () => mockRequest((s) => ({ cart: s.cart, orders: visibleOrders(s), account: currentEcommerceAccount(s) }));

const titleCase = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

export const loginEcommerce = async ({ email }: LoginEcommerceParams) => {
  await mockDelay();
  const name = email.split('@')[0].split(/[._-]+/).filter(Boolean).map(titleCase).join(' ');
  const shippingAddress = email.toLowerCase().startsWith('noaddress') ? '' : '12 Example Street, Springfield';
  return mockRequest((s) => s.loginEcommerce({ email, name, shippingAddress }));
};

export const logoutEcommerce = () => mockRequest((s) => s.logoutEcommerce());

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
