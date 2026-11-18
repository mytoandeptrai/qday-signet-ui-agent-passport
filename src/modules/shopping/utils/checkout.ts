import type { SpendingSession } from '@/types/passport';
import { type CartLine, inStock, maxQuantity, pricedCart } from './cart';

/** Illustrative shipping address; there is no address book. */
export const SAMPLE_SHIP_TO = 'Home · 12 Example Street, Springfield';

export type CheckoutProblem =
  | { code: 'empty' }
  | { code: 'unpayable'; name: string }
  | { code: 'sold-out'; name: string }
  | { code: 'too-many'; name: string; max: number }
  | { code: 'balance' };

/** Why this cart cannot be paid with this budget, or null when it can. The caller words the problem. */
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

/** What an agent's spending session has left to spend, to the cent. */
export const budgetLeft = (session: Pick<SpendingSession, 'limit' | 'spent'>) => Math.max(0, Math.round((session.limit - session.spent) * 100) / 100);

export type SessionProblem = 'expired' | 'budget' | 'per-call';

/** Why this session cannot pay `total` (a decimal amount), or null when it can. */
export function sessionProblem(session: Pick<SpendingSession, 'limit' | 'spent' | 'perCallLimit' | 'expiresAt'>, total: number, nowMs: number): SessionProblem | null {
  if (Date.parse(session.expiresAt) <= nowMs) return 'expired';
  if (budgetLeft(session) < total) return 'budget';
  if (session.perCallLimit < total) return 'per-call';
  return null;
}

/** The session offered when none can pay: the total rounded up to a multiple of 100, for one hour. */
export const proposedSession = (total: number) => {
  const limit = Math.max(100, Math.ceil(total / 100) * 100);
  return { limit, perCall: limit, hours: 1 };
};
