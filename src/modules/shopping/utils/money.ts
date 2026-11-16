// Prices are decimal strings with up to 6 decimals; sums are done in integer units so they never go through floating point.
const UNIT = 1_000_000n;

export function toAtomic(price: string): bigint {
  const [whole = '0', fraction = ''] = price.split('.');
  return BigInt(whole) * UNIT + BigInt(fraction.padEnd(6, '0').slice(0, 6));
}

/** `12000000n` -> "12.00", `4500000n` -> "4.50", `1234500n` -> "1.2345". */
export function formatAtomic(value: bigint): string {
  const whole = value / UNIT;
  const fraction = (value % UNIT).toString().padStart(6, '0').replace(/0+$/, '').padEnd(2, '0');
  return `${whole}.${fraction}`;
}

export const formatPrice = (price: string) => formatAtomic(toAtomic(price));
