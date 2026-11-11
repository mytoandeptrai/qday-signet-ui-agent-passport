import { SEED_USER } from './seed';
import { SERVICES } from './services';
import type { Service, User } from '@/types/passport';

/** The one-time code the mock accepts. */
export const MOCK_OTP = '123456';

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
  if (code !== MOCK_OTP) throw new MockApiError('That code is not right. Try 123456.', 'code');
  return { ...SEED_USER, email: email.toLowerCase() };
}

export interface ServiceQuery {
  search?: string;
  category?: string;
  sort?: 'popular' | 'price-asc' | 'price-desc' | 'name';
}

export async function listServices({ search = '', category = 'All', sort = 'popular' }: ServiceQuery): Promise<Service[]> {
  await delay(250);
  const q = search.trim().toLowerCase();
  const out = SERVICES.filter(
    (s) =>
      (category === 'All' || s.category === category) &&
      (!q || [s.name, s.description, s.provider, s.category].some((f) => f.toLowerCase().includes(q)))
  );
  const by: Record<NonNullable<ServiceQuery['sort']>, (a: Service, b: Service) => number> = {
    popular: (a, b) => Number(b.popular) - Number(a.popular) || a.name.localeCompare(b.name),
    'price-asc': (a, b) => a.pricePerCall - b.pricePerCall,
    'price-desc': (a, b) => b.pricePerCall - a.pricePerCall,
    name: (a, b) => a.name.localeCompare(b.name),
  };
  return out.sort(by[sort]);
}

export async function signInWithPasskey(): Promise<User> {
  await delay(700);
  return { ...SEED_USER, email: 'alex@example.com' };
}

export async function createPasskey(): Promise<void> {
  await delay(800);
}
