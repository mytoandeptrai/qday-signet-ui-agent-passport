import { mockRequest } from '../mock-transport';
import type { RedeemVoucherParams } from './types';

export const getVoucherList = () => mockRequest((s) => s.vouchers);
export const redeemVoucher = ({ code }: RedeemVoucherParams) => mockRequest((s) => s.redeemVoucher(code));
