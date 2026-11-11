import type { MainWallet, WalletTx, WalletTxKind } from '@/types/passport';

export type { MainWallet, WalletTx, WalletTxKind };

export interface SendFromMainParams {
  to: string;
  amount: number;
}
