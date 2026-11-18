export type SignRequestKind = 'create-signetpass' | 'transfer' | 'shop-checkout' | 'approve-agent' | 'create-session' | 'revoke' | 'enable-passkey' | 'disable-passkey';

export interface SignRequest {
  kind: SignRequestKind;
  summary: string;
}

export type SignStatus = 'idle' | 'waiting' | 'success' | 'rejected' | 'error';

export class WalletNotConnectedError extends Error {
  constructor() {
    super('wallet-not-connected');
  }
}

export class WalletUnsupportedNetworkError extends Error {
  constructor() {
    super('wallet-unsupported-network');
  }
}
