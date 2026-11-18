import { beforeEach, describe, expect, it } from 'vitest';
import { callService } from '@/apis/services/requests';
import { listServices, SERVICE_PAGE_SIZE } from '@/mock/api';
import { usePassportStore } from '@/stores/passport-store';
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

describe('calling a service', () => {
  const store = usePassportStore.getState;

  beforeEach(() => {
    store().reset();
    store().setContext('0xalice', 'base');
  });

  it('needs an active SignetPass and answers with the service endpoint', async () => {
    const { items } = await listServices({});
    const pass = store().createSignetPass({ name: 'Calls' });
    await expect(callService({ serviceId: items[0].id, passId: pass.id })).rejects.toThrow('not active');
    store().activateSignetPass(pass.id);
    const result = await callService({ serviceId: items[0].id, passId: pass.id });
    expect(result.status).toBe(200);
    expect(JSON.parse(result.body)).toMatchObject({ endpoint: items[0].endpoint, passId: pass.id });
    await expect(callService({ serviceId: 'missing', passId: pass.id })).rejects.toThrow('not found');
  });
});
