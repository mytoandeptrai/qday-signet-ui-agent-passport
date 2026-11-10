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

export const HOW_STEPS = [
  { n: '01', title: 'Install with one line', sun: 0.18 },
  { n: '02', title: 'Set your limits', sun: 0.5 },
  { n: '03', title: 'Ask for a job', sun: 0.86 },
];

export const DAY_MOMENTS: LandingMoment[] = [
  { time: '08:15', text: 'Called 12 hardware shops to ask who has the part', service: 'StablePhone' },
  { time: '10:00', text: 'Found the owners of 20 cafés, with verified emails', service: 'StableEnrich' },
  { time: '12:10', text: 'Booked a table for eight on Friday', service: 'AgentRes on Resy' },
  { time: '14:30', text: "Ordered a welcome kit to the new hire's door", service: 'Amazon' },
  { time: '16:05', text: 'Tried to buy an office chair', stopped: true },
  { time: '18:20', text: 'Mailed a printed thank-you letter to a customer', service: 'PostalForm' },
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
export const PLATE_IMAGES: { hero: string; session: string; how: [string, string, string]; day: string; close: string } = {
  hero: '',
  session: '',
  how: ['', '', ''],
  day: '',
  close: '',
};

/** Page lighting. `spill` is the glow the sun casts on the white page as it rises; `closing` tints the last section. */
export const LANDING_LIGHT = {
  spill: '246, 190, 150',
  closing: '176, 200, 236',
};
