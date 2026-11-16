import type { ShopOrderStatus } from '@/types/passport';

/** An account that can pay for an order: the Main Wallet, or an active SignetPass on the network in use. */
export interface PayAccount {
  /** `'wallet'` for the Main Wallet, else the SignetPass id. */
  id: string;
  name: string;
  kind: 'wallet' | 'signetpass';
  balance: number;
}

export interface SetCartQuantityParams {
  productId: string;
  quantity: number;
}

export interface PlaceOrderParams {
  payFrom: string;
}

export interface SetOrderStatusParams {
  id: string;
  from: ShopOrderStatus;
  to: ShopOrderStatus;
}
