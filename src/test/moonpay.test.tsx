import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { requestIpHash, requestSignature } from '@/integrations/moonpay/sign-url';
import userEvent from '@testing-library/user-event';
import { NETWORKS } from '@/constant';
import AddFundsCardUi from '@/modules/signetpass/components/add-funds-card-ui/add-funds-card-ui';

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

describe('Add funds card tab', () => {
  const network = NETWORKS.base;
  const address = '0x1234567890abcdef1234567890abcdef12345678';
  const base = { address, network, isOpening: false, isSwitching: false, onSwitchNetwork: vi.fn(), onContinue: vi.fn() };

  it('shows the purchase summary and continues to MoonPay on Base', async () => {
    const onContinue = vi.fn();
    render(<AddFundsCardUi {...base} onNetwork onContinue={onContinue} />);
    expect(screen.getByText('add-funds.card.token-on')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /add-funds.card.continue/ }));
    expect(onContinue).toHaveBeenCalled();
  });

  it('asks to switch to Base first when on another network', async () => {
    const onSwitchNetwork = vi.fn();
    render(<AddFundsCardUi {...base} onNetwork={false} onSwitchNetwork={onSwitchNetwork} />);
    expect(screen.queryByRole('button', { name: /add-funds.card.continue/ })).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: /add-funds.card.switch/ }));
    expect(onSwitchNetwork).toHaveBeenCalled();
  });

  it('is busy while MoonPay opens', () => {
    render(<AddFundsCardUi {...base} onNetwork isOpening />);
    expect(screen.getByRole('button', { name: /add-funds.card.opening/ })).toHaveAttribute('aria-busy', 'true');
  });
});
