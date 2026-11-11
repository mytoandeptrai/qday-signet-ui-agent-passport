import type { Voucher } from '@/types/passport';

export type { Voucher };

export interface RedeemVoucherParams {
  code: string;
}

export type RedeemVoucherResponse = { ok: true; amount: number } | { ok: false; error: string };
