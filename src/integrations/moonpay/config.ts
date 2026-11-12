// MoonPay on-ramp. A pk_test key runs the widget in sandbox, a pk_live key in production.
export const moonPayConfig = {
  apiKey: import.meta.env.VITE_MOONPAY_PUBLISHABLE_KEY || '',
  // Server holding the secret key: GET /ip-hash and GET /sign-url.
  serverUrl: (import.meta.env.VITE_MOONPAY_SERVER_URL || '').replace(/\/$/, ''),
  // Sandbox has no Base, so test with eth (Sepolia); production uses usdc_base.
  currencyCode: import.meta.env.VITE_MOONPAY_CURRENCY_CODE || 'eth',
};

// Prefilled wallet addresses must be signed, so the feature needs both the key and the signing server.
export const isMoonPayEnabled = Boolean(moonPayConfig.apiKey && moonPayConfig.serverUrl);
