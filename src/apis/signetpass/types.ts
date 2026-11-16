import type { SignetPass } from '@/types/passport';

export type { SignetPass };

/** The pass is created on the network the Main Wallet is on. */
export interface CreateSignetPassParams {
  name: string;
}

export interface RenameSignetPassParams {
  id: string;
  name: string;
}

export interface ActivateSignetPassParams {
  id: string;
}

export interface SelectSignetPassParams {
  id: string;
}

export interface FundFromMainParams {
  amount: number;
}
