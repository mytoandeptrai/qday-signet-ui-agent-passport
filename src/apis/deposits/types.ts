import type { Deposit, DepositMethod } from '@/types/passport';

export type { Deposit, DepositMethod };

export interface CreateDepositParams {
  amount: number;
  method: DepositMethod;
}
