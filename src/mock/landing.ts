import type { LandingLedgerRow, LandingMoment } from '@/types/passport';

export const BRAND = 'Signet';
export const INSTALL_COMMAND = 'curl -fsSL https://signet.example/install.sh | bash';
export const INSTALL_PROMPT = `Install Signet: run \`${INSTALL_COMMAND}\`. It adds the signet command and the Signet skills, and you can read the script first. When it finishes, tell me in plain words what it printed, including the examples and the part about ideas for my own work.`;

export const HERO_WORDS = ['shopping', 'APIs', 'leads'] as const;

export const PARTNERS = [
  'General Catalyst', 'PayPal Ventures', 'Google Cloud (AP2)', 'Coinbase Ventures', 'Avalanche', 'LayerZero',
  'GSR', 'Samsung NEXT', 'OKX Wallet', 'Bitget Wallet', 'Privy', 'Crossmint', 'PayPal PYUSD', 'x402',
];

export const SESSION_CARD = {
  title: 'Team dinner for 12',
  limit: 20,
  perCall: 5,
  rows: [
    { service: 'StablePhone, 6 calls', amount: 3.24, time: '10:02' },
    { service: 'Resy booking', amount: 0.01, time: '10:31' },
    { service: 'Hugen Weather', amount: 0.01, time: '10:33' },
    { service: 'Amazon, table flowers', amount: 48, time: 'Stopped', stopped: true },
  ] satisfies LandingLedgerRow[],
  points: ['Set your spending rules', 'Agents pay freely within those rules', 'Revoke at any time'],
};

export const HOW_STEPS: { n: string; title: string; scene: 'install' | 'limits' | 'job'; level: number }[] = [
  { n: '01', title: 'Install with one line', scene: 'install', level: 0.9 },
  { n: '02', title: 'Set your limits', scene: 'limits', level: 0.8 },
  { n: '03', title: 'Ask for a job', scene: 'job', level: 0.7 },
];

export const DAY_MOMENTS: LandingMoment[] = [
  { time: '08:15', text: 'Called 12 hardware shops to ask who has the part', service: 'StablePhone', amount: 3.24 },
  { time: '10:00', text: 'Found the owners of 20 cafés, with verified emails', service: 'StableEnrich', amount: 0.8 },
  { time: '12:10', text: 'Booked a table for eight on Friday', service: 'AgentRes on Resy', amount: 1 },
  { time: '14:30', text: "Ordered a welcome kit to the new hire's door", service: 'Amazon', amount: 38.9 },
  { time: '16:05', text: 'Tried to buy an office chair', amount: 142, stopped: true },
  { time: '18:20', text: 'Mailed a printed thank-you letter to a customer', service: 'PostalForm', amount: 2.4 },
];

export const FOOTER_COLUMNS = [
  { title: 'Product', links: [
    { label: 'How it works', href: '/#how' },
    { label: 'Explore', href: '/explore' },
    { label: 'Ecosystem', href: '/ecosystem' },
    { label: 'Sign in', href: '/login' },
  ] },
  { title: 'Signet', links: [
    { label: 'Documentation', href: '#' },
    { label: 'Discord', href: '#' },
    { label: 'X', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ] },
  { title: 'Legal', links: [
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
  ] },
];

/**
 * Swap the artwork here. Put files in `public/images/landing/` and reference them as
 * '/images/landing/hero.jpg'. Leave a value empty to keep the drawn print.
 */
export const PLATE_IMAGES: { hero: string; session: string; how: [string, string, string]; close: string } = {
  hero: '',
  session: '',
  how: ['', '', ''],
  close: '',
};

/** Page lighting. `spill` is the glow the hero plate casts on the white page as it lights up. */
export const LANDING_LIGHT = {
  spill: '96, 242, 255',
};
