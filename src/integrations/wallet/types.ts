export type SignRequestKind = 'create-signetpass' | 'transfer' | 'approve-agent' | 'create-session' | 'revoke';

export interface SignRequest {
  kind: SignRequestKind;
  /** Human-readable line shown while waiting for the signature, and written into the signed message. */
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
