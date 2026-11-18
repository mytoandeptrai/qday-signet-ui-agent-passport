import { type ShopProduct, shopCatalog } from './catalog';
import { toAtomic } from './money';

/** Products per page: the desktop grid shows more than the 5 of the Trellis phone screen. */
export const SHOP_PAGE_SIZE = 12;
const MAX_SEARCH_TERMS = 8;
const MIN_PREFIX_LENGTH = 3;

export const SHOP_SORTS = ['relevance', 'newest', 'price_asc', 'price_desc'] as const;
export type ShopSort = (typeof SHOP_SORTS)[number];

/** The words of a search: letters and digits only, as the Bazaar reads them. */
export function searchWords(search: string): string[] {
  return (search.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []).slice(0, MAX_SEARCH_TERMS);
}

/** A word matches as the start of a word ("ear" finds "earbuds"), and a trailing "s" is dropped ("bars" finds "bar"). */
function termMatches(term: string, tokens: string[]) {
  const stem = term.length > MIN_PREFIX_LENGTH && term.endsWith('s') ? term.slice(0, -1) : term;
  return tokens.some((token) => (stem.length >= MIN_PREFIX_LENGTH ? token.startsWith(stem) : token === stem));
}

/** Any word counts; a match in the name beats category or tags, which beat the description. */
export function relevance(product: ShopProduct, words: string[]): number {
  const tokens = (text: string) => searchWords(text);
  const name = tokens(product.name);
  const labels = tokens([product.category, ...product.tags].join(' '));
  const description = tokens(product.description);
  let score = 0;
  for (const word of words) {
    if (termMatches(word, name)) score += 4;
    else if (termMatches(word, labels)) score += 2;
    else if (termMatches(word, description)) score += 1;
  }
  return score;
}

/** The merchant dropdown's value for "every merchant". */
export const ALL_MERCHANTS = 'all';

export const MAX_TAGS = 5;
export const MAX_MERCHANT_FILTER = 50;

export interface ShopQuery {
  search?: string | undefined;
  sort?: ShopSort | undefined;
  category?: string | undefined;
  /** Tags a product must ALL have. */
  tags?: string[] | undefined;
  /** The most a product may cost, inclusive, as a decimal string. */
  maxPrice?: string | undefined;
  /** Only these merchants (by id). Empty or left out = every merchant. */
  merchantIds?: string[] | undefined;
  /** The buyer's country: kept when not banned and, if the product lists countries, one of them. */
  location?: string | undefined;
  /** Only products that accept payment on this blockchain. */
  chainId: string;
  offset?: number;
  limit?: number;
}

export interface ShopPage {
  items: ShopProduct[];
  total: number;
  hasMore: boolean;
}

export function searchProducts(query: ShopQuery): ShopPage {
  const words = searchWords(query.search ?? '');
  const searching = words.length > 0;
  const sort =
    query.sort === 'relevance' && !searching ? 'newest' : (query.sort ?? (searching ? 'relevance' : 'newest'));
  const category = query.category?.toLowerCase();
  const tags = (query.tags ?? []).map((tag) => tag.toLowerCase());
  const maxPrice = query.maxPrice && isValidMaxPrice(query.maxPrice) ? toAtomic(query.maxPrice) : undefined;
  const merchants = query.merchantIds ?? [];
  const location = query.location?.toUpperCase();

  const matches = shopCatalog
    .map((product, listed) => ({
      product,
      listed,
      score: searching ? relevance(product, words) : 0,
    }))
    .filter(({ product, score }) => {
      if (!product.chains.includes(query.chainId)) return false;
      if (category && product.category.toLowerCase() !== category) return false;
      if (tags.some((tag) => !product.tags.some((t) => t.toLowerCase() === tag))) return false;
      if (maxPrice !== undefined && toAtomic(product.price) > maxPrice) return false;
      if (merchants.length > 0 && !merchants.includes(product.merchant.id)) return false;
      if (location && !sellsTo(product, location)) return false;
      return !searching || score > 0;
    });

  matches.sort((a, b) => {
    if (sort === 'price_asc' || sort === 'price_desc') {
      const diff = Number(toAtomic(a.product.price) - toAtomic(b.product.price));
      if (diff !== 0) return sort === 'price_asc' ? diff : -diff;
    } else if (sort === 'relevance' && b.score !== a.score) {
      return b.score - a.score;
    }
    return a.listed - b.listed; // newest listing first, and a stable tie-break
  });

  const offset = query.offset ?? 0;
  const limit = query.limit ?? SHOP_PAGE_SIZE;
  return {
    items: matches.slice(offset, offset + limit).map(({ product }) => product),
    total: matches.length,
    hasMore: offset + limit < matches.length,
  };
}

/** A product is kept when the country is not banned and, if it lists countries it sells to, is one of them. */
export function sellsTo(product: ShopProduct, country: string): boolean {
  const code = country.toUpperCase();
  if (product.bannedLocations.includes(code)) return false;
  return product.acceptedLocations.length === 0 || product.acceptedLocations.includes(code);
}

const PRICE_PATTERN = /^\d{1,31}(\.\d{1,6})?$/;

/** The Bazaar's rule for `maxPrice`: a non-negative decimal with at most 6 decimals. Empty is fine. */
export function isValidMaxPrice(input: string) {
  const value = input.trim();
  return value === '' || PRICE_PATTERN.test(value);
}

/** Countries a buyer can pick as "ships to": illustrative, the real list is any ISO code. */
export const shopCountries = [
  { code: 'VN', name: 'Vietnam' },
  { code: 'SG', name: 'Singapore' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'AU', name: 'Australia' },
] as const;

export const countryName = (code: string) => shopCountries.find((c) => c.code === code)?.name ?? code;

/** Tags of the products payable on this blockchain, most common first. */
export function shopTags(chainId: string): string[] {
  const counts = new Map<string, number>();
  for (const product of shopCatalog) {
    if (!product.chains.includes(chainId)) continue;
    for (const tag of product.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tag]) => tag);
}

/** Merchants with a product payable on this blockchain, with how many. */
export function shopMerchants(chainId: string): { id: string; name: string; count: number }[] {
  const merchants = new Map<string, { id: string; name: string; count: number }>();
  for (const product of shopCatalog) {
    if (!product.chains.includes(chainId)) continue;
    const found = merchants.get(product.merchant.id);
    if (found) found.count += 1;
    else merchants.set(product.merchant.id, { ...product.merchant, count: 1 });
  }
  return [...merchants.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** What the filter popup edits. The blockchain, currency and `ecommerce` type are not filters here. */
export interface ShopFilters {
  sort?: ShopSort | undefined;
  category?: string | undefined;
  tags: string[];
  /** Decimal string; empty = no limit. */
  maxPrice: string;
  merchantIds: string[];
  location?: string | undefined;
}

export const emptyFilters = (): ShopFilters => ({ tags: [], maxPrice: '', merchantIds: [] });

/** How many filters are set (sort is an order, not a filter). Each of the five kinds counts once. */
export function activeFilterCount(filters: ShopFilters): number {
  return [
    filters.category !== undefined,
    filters.tags.length > 0,
    filters.maxPrice.trim() !== '',
    filters.merchantIds.length > 0,
    filters.location !== undefined,
  ].filter(Boolean).length;
}

export function filtersToQuery(search: string, filters: ShopFilters, chainId: string, limit?: number): ShopQuery {
  return {
    search,
    sort: filters.sort,
    category: filters.category,
    tags: filters.tags,
    maxPrice: filters.maxPrice.trim(),
    merchantIds: filters.merchantIds,
    location: filters.location,
    chainId,
    ...(limit === undefined ? {} : { limit }),
  };
}

/** Categories that have a product payable on this blockchain, in catalogue order. */
export function shopCategories(chainId: string): string[] {
  return [...new Set(shopCatalog.filter((p) => p.chains.includes(chainId)).map((product) => product.category))].sort();
}
