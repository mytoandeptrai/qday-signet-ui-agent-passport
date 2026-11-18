import type { SignetPass } from '@/types/passport';

export type { SignetPass };

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

export interface GetInstallCodeParams {
  passId: string;
}

export interface FundFromMainParams {
  amount: number;
}
