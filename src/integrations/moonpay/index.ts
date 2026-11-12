import { lazy } from 'react';

export { isMoonPayEnabled, moonPayConfig } from './config';
export { requestSignature } from './sign-url';
export type { MoonPayBuyWidgetProps } from './moonpay-buy-widget';

export const MoonPayBuyWidget = lazy(() => import('./moonpay-buy-widget'));
