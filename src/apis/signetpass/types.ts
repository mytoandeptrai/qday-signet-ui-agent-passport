import type { NetworkKey } from '@/constant';
import type { SignetPass } from '@/types/passport';

export type { SignetPass };

export interface CreateSignetPassParams {
  name: string;
  network: NetworkKey;
}

export interface SelectSignetPassParams {
  id: string;
}

export interface FundFromMainParams {
  amount: number;
}
