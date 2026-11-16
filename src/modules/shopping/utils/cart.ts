import { type ShopProduct, getShopProduct } from './catalog';
import { formatAtomic, toAtomic } from './money';

export const MAX_CART_QUANTITY = 10;

export interface CartLine {
  productId: string;
  quantity: number;
}

export interface PricedLine {
  product: ShopProduct;
  quantity: number;
  total: bigint;
  /** Whether the merchant accepts payment on the blockchain in use. */
  payable: boolean;
}

/** The most of a product one cart may hold: the stock, and never more than a sensible cap. */
export const maxQuantity = (product: ShopProduct) => Math.min(MAX_CART_QUANTITY, product.quantity ?? MAX_CART_QUANTITY);

export const inStock = (product: ShopProduct) => product.quantity === null || product.quantity > 0;

export const canPayOn = (product: ShopProduct, chainId: string) => product.chains.includes(chainId);

export const removeFromCart = (cart: CartLine[], productId: string) =>
  cart.filter((line) => line.productId !== productId);

/** Zero or less removes the line; more than the stock allows is held at the stock. */
export function setQuantity(cart: CartLine[], productId: string, quantity: number): CartLine[] {
  const product = getShopProduct(productId);
  if (!product) return cart;
  if (quantity <= 0) return removeFromCart(cart, productId);
  const next = Math.min(Math.floor(quantity), maxQuantity(product));
  return cart.map((line) => (line.productId === productId ? { ...line, quantity: next } : line));
}

export function addToCart(cart: CartLine[], productId: string): CartLine[] {
  const product = getShopProduct(productId);
  if (!product || !inStock(product)) return cart;
  const existing = cart.find((line) => line.productId === productId);
  if (!existing) return [...cart, { productId, quantity: 1 }];
  return setQuantity(cart, productId, existing.quantity + 1);
}

export const cartCount = (cart: CartLine[]) => cart.reduce((sum, line) => sum + line.quantity, 0);

export function pricedCart(cart: CartLine[], chainId: string): PricedLine[] {
  return cart.flatMap((line) => {
    const product = getShopProduct(line.productId);
    if (!product) return [];
    return [
      {
        product,
        quantity: line.quantity,
        total: toAtomic(product.price) * BigInt(line.quantity),
        payable: canPayOn(product, chainId),
      },
    ];
  });
}

export const cartTotal = (lines: readonly PricedLine[]) => lines.reduce((sum, line) => sum + line.total, 0n);

/** The stable-coin amount of a priced cart as the number the mock balances use. */
export const cartTotalAmount = (lines: readonly PricedLine[]) => Number(formatAtomic(cartTotal(lines)));

/** How many are left when stock is low (up to 5), else null. Out of stock reads as 0. */
export const lowStock = (product: ShopProduct) =>
  product.quantity !== null && product.quantity <= 5 ? product.quantity : null;
