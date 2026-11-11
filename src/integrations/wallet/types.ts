export interface WalletSession {
  address: string;
  chainId: number;
}

export type SignRequestKind = 'create-signetpass' | 'transfer' | 'approve-agent' | 'create-session' | 'revoke';

export interface SignRequest {
  kind: SignRequestKind;
  /** Human-readable line shown while waiting for the signature. */
  summary: string;
}

export type SignStatus = 'idle' | 'waiting' | 'success' | 'rejected' | 'error';

/** The seam between the UI and the wallet: replace the mock with a wagmi/viem adapter without touching the UI. */
export interface WalletAdapter {
  connect: () => Promise<WalletSession>;
  disconnect: () => Promise<void>;
  sign: (request: SignRequest) => Promise<{ signature: string }>;
}

export class WalletRejectedError extends Error {
  constructor() {
    super('wallet-rejected');
  }
}

export class WalletNotConnectedError extends Error {
  constructor() {
    super('wallet-not-connected');
  }
}
