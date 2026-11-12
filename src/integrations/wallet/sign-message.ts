import type { SignRequest, SignRequestKind } from './types';

const TITLES: Record<SignRequestKind, string> = {
  'create-signetpass': 'Create SignetPass',
  transfer: 'Transfer funds',
  'approve-agent': 'Approve agent registration',
  'create-session': 'Create spending session',
  revoke: 'Revoke access',
};

interface SignContext {
  address: string;
  chainId: number;
  chainName: string;
}

/**
 * The text MetaMask shows and the user signs. Readable first, then the fields that bind it to one
 * wallet, chain and moment so the signature can't be replayed elsewhere.
 */
export const buildSignMessage = ({ kind, summary }: SignRequest, { address, chainId, chainName }: SignContext) =>
  [
    `Signet: ${TITLES[kind]}`,
    summary,
    '',
    `Address: ${address}`,
    `Chain: ${chainName} (${chainId})`,
    `Nonce: ${crypto.randomUUID()}`,
    `Issued at: ${new Date().toISOString()}`,
  ].join('\n');
