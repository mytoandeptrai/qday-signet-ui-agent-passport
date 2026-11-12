import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { requestIpHash, requestSignature } from '@/integrations/moonpay/sign-url';
import OverviewBalanceUi from '@/modules/overview/components/overview-balance-ui/overview-balance-ui';

vi.mock('@/integrations/moonpay/config', () => ({
  moonPayConfig: { apiKey: 'pk_test_x', serverUrl: 'https://signer.test', currencyCode: 'eth' },
  isMoonPayEnabled: true,
}));

vi.mock('@/integrations/i18n', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

afterEach(() => vi.unstubAllGlobals());

describe('requestSignature', () => {
  it('sends the encoded widget url and returns the raw signature', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ signature: 'abc+/=' }) });
    vi.stubGlobal('fetch', fetchMock);

    await expect(requestSignature('https://buy.moonpay.com?apiKey=pk_test_x&currencyCode=eth')).resolves.toBe('abc+/=');
    expect(fetchMock).toHaveBeenCalledWith(
      `https://signer.test/sign-url?url=${encodeURIComponent('https://buy.moonpay.com?apiKey=pk_test_x&currencyCode=eth')}`,
    );
  });

  it('throws when the server fails or returns no signature', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    await expect(requestSignature('u')).rejects.toThrow();

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));
    await expect(requestSignature('u')).rejects.toThrow();
  });
});

describe('requestIpHash', () => {
  it('returns the hashed client IP from the server', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ allowedIpAddress: 'hash=' }) });
    vi.stubGlobal('fetch', fetchMock);

    await expect(requestIpHash()).resolves.toBe('hash=');
    expect(fetchMock).toHaveBeenCalledWith('https://signer.test/ip-hash');
  });

  it('throws when the server returns no hash', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));
    await expect(requestIpHash()).rejects.toThrow();
  });
});

describe('Buy with card button', () => {
  const base = { available: 10, onCopyAddress: vi.fn(), onAddFunds: vi.fn(), buyPending: false, onBuyWithCard: vi.fn() };

  it('is hidden when buying is not available', () => {
    render(<OverviewBalanceUi {...base} canBuyWithCard={false} />);
    expect(screen.queryByText('balance.buy-card')).toBeNull();
  });

  it('shows the button and the receiving address when available', () => {
    render(<OverviewBalanceUi {...base} canBuyWithCard buyAddress='0x1234567890abcdef1234567890abcdef12345678' />);
    expect(screen.getByRole('button', { name: /balance.buy-card/ })).toBeEnabled();
    expect(screen.getByText('balance.buy-card-note')).toBeInTheDocument();
  });

  it('is busy while MoonPay opens', () => {
    render(<OverviewBalanceUi {...base} canBuyWithCard buyPending buyAddress='0x1234567890abcdef1234567890abcdef12345678' />);
    expect(screen.getByRole('button', { name: /balance.buy-card/ })).toHaveAttribute('aria-busy', 'true');
  });
});
