import type { ShopOrderStatus } from '@/types/passport';

/** The three steps every order goes through, in order. */
export const ORDER_STEPS: readonly ShopOrderStatus[] = ['paid', 'shipped', 'delivered'];
