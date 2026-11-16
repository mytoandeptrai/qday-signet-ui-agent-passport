import { describe, expect, it } from 'vitest';
import {
  MAX_CART_QUANTITY,
  SHOP_PAGE_SIZE,
  addToCart,
  cartTotal,
  checkoutProblem,
  emptyFilters,
  filtersToQuery,
  formatAtomic,
  maxQuantity,
  pricedCart,
  searchProducts,
  setQuantity,
  shopCatalog,
  toAtomic,
} from '@/modules/shopping/utils';

const query = (search: string, over: Partial<ReturnType<typeof emptyFilters>> = {}) =>
  searchProducts(filtersToQuery(search, { ...emptyFilters(), ...over }, 'base', 100));

describe('shop money', () => {
  it('adds prices without floating point drift', () => {
    expect(formatAtomic(toAtomic('0.1') + toAtomic('0.2'))).toBe('0.30');
    expect(formatAtomic(toAtomic('4.5') * 3n)).toBe('13.50');
    expect(formatAtomic(toAtomic('1.2345'))).toBe('1.2345');
  });
});

describe('shop search', () => {
  it('lists every product payable on the chain, newest first, a page at a time', () => {
    const page = searchProducts({ chainId: 'base' });
    expect(page.items).toHaveLength(Math.min(SHOP_PAGE_SIZE, page.total));
    expect(page.items[0].id).toBe(shopCatalog[0].id);
    expect(searchProducts({ chainId: 'unknown' }).total).toBe(0);
  });

  it('matches the start of a word and ranks a name match above a description match', () => {
    const result = query('ear').items;
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].name.toLowerCase()).toContain('earbuds');
    expect(query('zzzzz').total).toBe(0);
  });

  it('filters by category, price ceiling and merchant', () => {
    const home = query('', { category: 'Home' }).items;
    expect(home.length).toBeGreaterThan(0);
    expect(home.every((p) => p.category === 'Home')).toBe(true);
    const cheap = query('', { maxPrice: '10' }).items;
    expect(cheap.every((p) => toAtomic(p.price) <= toAtomic('10'))).toBe(true);
    const merchantId = shopCatalog[0].merchant.id;
    expect(query('', { merchantIds: [merchantId] }).items.every((p) => p.merchant.id === merchantId)).toBe(true);
  });

  it('drops products that do not ship to the buyer country', () => {
    const banned = shopCatalog.find((p) => p.bannedLocations.includes('AU'));
    expect(banned).toBeDefined();
    expect(query('', { location: 'AU' }).items.some((p) => p.id === banned?.id)).toBe(false);
    expect(query('', { location: 'VN' }).items.some((p) => p.id === banned?.id)).toBe(true);
  });
});

describe('shop cart', () => {
  const [a, b] = shopCatalog;

  it('adds, counts and holds a line at the stock cap', () => {
    let cart = addToCart([], a.id);
    cart = addToCart(cart, a.id);
    expect(cart).toEqual([{ productId: a.id, quantity: 2 }]);
    cart = setQuantity(cart, a.id, 999);
    expect(cart[0].quantity).toBe(maxQuantity(a));
    expect(maxQuantity(a)).toBeLessThanOrEqual(MAX_CART_QUANTITY);
    expect(setQuantity(cart, a.id, 0)).toEqual([]);
  });

  it('prices lines in integer units and flags a product the chain does not accept', () => {
    const cart = [
      { productId: a.id, quantity: 2 },
      { productId: b.id, quantity: 1 },
    ];
    const lines = pricedCart(cart, 'base');
    expect(cartTotal(lines)).toBe(toAtomic(a.price) * 2n + toAtomic(b.price));
    expect(pricedCart(cart, 'unknown').every((l) => !l.payable)).toBe(true);
  });

  it('explains why a cart cannot be paid', () => {
    const cart = [{ productId: a.id, quantity: 1 }];
    expect(checkoutProblem([], 'base', 1000)).toEqual({ code: 'empty' });
    expect(checkoutProblem(cart, 'unknown', 1000)).toMatchObject({ code: 'unpayable', name: a.name });
    expect(checkoutProblem(cart, 'base', 0)).toEqual({ code: 'balance' });
    expect(checkoutProblem(cart, 'base', Number(a.price))).toBeNull();
  });
});
