import { formatDistanceToNow } from 'date-fns';

export const money = (n: number) =>
  n < 0.01 && n > 0 ? `$${n.toFixed(3)}` : `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const timeAgo = (iso: string) => formatDistanceToNow(new Date(iso), { addSuffix: true });

export const shortAddress = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

/** Only same-origin paths may be used as a post-login redirect. */
export const safeRedirect = (to: string | undefined, fallback = '/overview') => (to?.startsWith('/') && !to.startsWith('//') ? to : fallback);
