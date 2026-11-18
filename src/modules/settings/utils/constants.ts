export const APP_VERSION = '1.0.0';

export const RESOURCE_LINKS = [
  { id: 'wiki', href: 'https://example.com' },
  { id: 'price-oracle', href: 'https://example.com' },
  { id: 'website', href: 'https://example.com' },
  { id: 'explorer', href: 'https://example.com' },
] as const;

export type SettingsSheetId = 'limits' | 'notifications' | 'history' | 'resources';
