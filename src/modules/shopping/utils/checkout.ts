import { type CartLine, inStock, maxQuantity, pricedCart } from './cart';

/** Illustrative shipping address; there is no address book. */
export const SAMPLE_SHIP_TO = 'Home · 12 Example Street, Springfield';

export type CheckoutProblem =
  | { code: 'empty' }
  | { code: 'unpayable'; name: string }
  | { code: 'sold-out'; name: string }
  | { code: 'too-many'; name: string; max: number }
  | { code: 'balance' };

/** Why this cart cannot be paid with this balance, or null when it can. The caller words the problem. */
export function checkoutProblem(cart: CartLine[], chainId: string, balance: number): CheckoutProblem | null {
  const lines = pricedCart(cart, chainId);
  if (lines.length === 0) return { code: 'empty' };
  const unpayable = lines.find((line) => !line.payable);
  if (unpayable) return { code: 'unpayable', name: unpayable.product.name };
  const soldOut = lines.find((line) => !inStock(line.product));
  if (soldOut) return { code: 'sold-out', name: soldOut.product.name };
  const tooMany = lines.find((line) => line.quantity > maxQuantity(line.product));
  if (tooMany) return { code: 'too-many', name: tooMany.product.name, max: maxQuantity(tooMany.product) };
  const total = lines.reduce((sum, line) => sum + Number(line.total), 0) / 1_000_000;
  return balance < total ? { code: 'balance' } : null;
}
