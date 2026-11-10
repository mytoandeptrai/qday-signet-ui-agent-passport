import { env } from './base.const';

export const siteConfig = {
  author: 'QDAY',
  title: 'Signet · Let your agents pay',
  description: 'Signet gives your agent a balance it can spend across 2,000+ services, strictly within the limits you set.',
  url: 'https://signet.example',
  canonicalUrl: 'https://signet.example',
  twitter: '@signet',
  github: '',
  nav: [{ name: 'Home', href: '/' }],
  keywords: ['Signet', 'AI agents', 'payments', 'spending limits'],
  googleAnalyticsId: env.GA_ID,
};
