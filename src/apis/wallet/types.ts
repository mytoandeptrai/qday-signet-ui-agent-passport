import type { NetworkKey } from '@/constant';
import type { MainWallet, WalletTx, WalletTxKind } from '@/types/passport';

export type { MainWallet, WalletTx, WalletTxKind };

/** The Main Wallet in use: the connected account's balance on the network it is on. `address` is null while disconnected. */
export interface MainWalletView extends MainWallet {
  address: string | null;
  network: NetworkKey;
}

export interface SendFromMainParams {
  to: string;
  amount: number;
}
