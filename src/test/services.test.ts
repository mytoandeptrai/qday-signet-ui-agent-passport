import { describe, expect, it } from 'vitest';
import { listServices, SERVICE_PAGE_SIZE } from '@/mock/api';
import { ECOMMERCE_CATEGORY } from '@/mock/services';

describe('marketplace services', () => {
  it('leaves out ecommerce and sorts most popular by sales', async () => {
    const { items, total } = await listServices({});
    expect(items.some((s) => s.category === ECOMMERCE_CATEGORY)).toBe(false);
    expect(items.map((s) => s.sales)).toEqual([...items.map((s) => s.sales)].sort((a, b) => b - a));
    expect(total).toBeGreaterThan(SERVICE_PAGE_SIZE);
  });

  it('paginates and sorts by name', async () => {
    const first = await listServices({ sort: 'name', page: 1 });
    const second = await listServices({ sort: 'name', page: 2 });
    expect(first.items).toHaveLength(SERVICE_PAGE_SIZE);
    expect(second.items[0].name.localeCompare(first.items[SERVICE_PAGE_SIZE - 1].name)).toBeGreaterThan(0);
  });

  it('gives every service an x402 endpoint and an accepted currency', async () => {
    const { items } = await listServices({});
    for (const s of items) {
      expect(s.endpoint).toMatch(/^https:\/\/.+\/x402\//);
      expect(s.currencies).toContain('USDC (Base)');
    }
  });
});
