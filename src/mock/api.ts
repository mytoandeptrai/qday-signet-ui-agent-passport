import { SEED_USER } from './seed';
import { ECOMMERCE_CATEGORY, SERVICES } from './services';
import type { Service, User } from '@/types/passport';

export const MOCK_OTP = '12345678';

export class MockApiError extends Error {
  constructor(
    message: string,
    readonly field?: string
  ) {
    super(message);
  }
}

const delay = (ms = 450) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function requestLoginCode(email: string): Promise<void> {
  await delay();
  if (email.toLowerCase().startsWith('blocked@')) throw new MockApiError('This account is suspended.', 'email');
}

export async function verifyLoginCode(email: string, code: string): Promise<User> {
  await delay();
  if (code !== MOCK_OTP) throw new MockApiError('That code is not right. Try 12345678.', 'code');
  return { ...SEED_USER, email: email.toLowerCase() };
}

export interface ServiceQuery {
  search?: string;
  category?: string;
  sort?: 'popular' | 'price-asc' | 'price-desc' | 'name';
  page?: number;
}

export const SERVICE_PAGE_SIZE = 12;

export async function listServices({ search = '', category = 'All', sort = 'popular', page = 1 }: ServiceQuery): Promise<{ items: Service[]; total: number }> {
  await delay(250);
  const q = search.trim().toLowerCase();
  const out = SERVICES.filter(
    (s) =>
      s.category !== ECOMMERCE_CATEGORY &&
      (category === 'All' || s.category === category) &&
      (!q || [s.name, s.description, s.provider, s.category].some((f) => f.toLowerCase().includes(q)))
  );
  const by: Record<NonNullable<ServiceQuery['sort']>, (a: Service, b: Service) => number> = {
    popular: (a, b) => b.sales - a.sales || a.name.localeCompare(b.name),
    'price-asc': (a, b) => a.pricePerCall - b.pricePerCall,
    'price-desc': (a, b) => b.pricePerCall - a.pricePerCall,
    name: (a, b) => a.name.localeCompare(b.name),
  };
  out.sort(by[sort]);
  return { items: out.slice((page - 1) * SERVICE_PAGE_SIZE, page * SERVICE_PAGE_SIZE), total: out.length };
}
