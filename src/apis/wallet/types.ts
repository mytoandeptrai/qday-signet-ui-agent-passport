import type { NetworkKey } from '@/constant';
import type { MainWallet, WalletTx, WalletTxKind } from '@/types/passport';

export type { MainWallet, WalletTx, WalletTxKind };

export interface MainWalletView extends MainWallet {
  address: string | null;
  network: NetworkKey;
}

export interface SendFromMainParams {
  to: string;
  amount: number;
}
