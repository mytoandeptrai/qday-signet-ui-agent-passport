import type { ShopOrderStatus } from '@/types/passport';

export interface LoginEcommerceParams {
  merchantId: string;
  email: string;
  password: string;
}

export interface SetCartQuantityParams {
  productId: string;
  quantity: number;
}

export interface PlaceOrderParams {
  sessionId: string;
  merchantId: string;
}

export interface SetOrderStatusParams {
  id: string;
  from: ShopOrderStatus;
  to: ShopOrderStatus;
}
