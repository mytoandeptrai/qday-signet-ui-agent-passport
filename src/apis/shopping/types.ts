import type { ShopOrderStatus } from '@/types/passport';

export interface SetCartQuantityParams {
  productId: string;
  quantity: number;
}

export interface PlaceOrderParams {
  /** The active spending session that pays. */
  sessionId: string;
}

export interface SetOrderStatusParams {
  id: string;
  from: ShopOrderStatus;
  to: ShopOrderStatus;
}
