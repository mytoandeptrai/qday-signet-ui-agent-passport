import { describe, expect, it } from 'vitest';
import { buildSignMessage } from '@/integrations/wallet/sign-message';

const context = { address: '0xabc', chainId: 44005, chainName: 'QDay' };

describe('buildSignMessage', () => {
  it('is readable and binds the wallet, chain and time', () => {
    const message = buildSignMessage({ kind: 'create-session', summary: 'Limit 50 USD8' }, context);
    expect(message).toContain('Signet: Create spending session');
    expect(message).toContain('Limit 50 USD8');
    expect(message).toContain('Address: 0xabc');
    expect(message).toContain('Chain: QDay (44005)');
    expect(message).toMatch(/Nonce: [0-9a-f-]{36}/);
    expect(message).toMatch(/Issued at: \d{4}-\d{2}-\d{2}T/);
  });

  it('uses a fresh nonce each time', () => {
    const request = { kind: 'transfer', summary: 'x' } as const;
    expect(buildSignMessage(request, context)).not.toBe(buildSignMessage(request, context));
  });
});
