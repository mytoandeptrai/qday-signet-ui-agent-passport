import { mockDelay } from '@/lib/mock-delay';
import { mockRequest } from '../mock-transport';
import type { FundFromMainParams } from './types';

export const getSignetPass = () => mockRequest((s) => s.signetPass);

export const createSignetPass = async () => {
  await mockDelay();
  return mockRequest((s) => s.createSignetPass());
};

export const fundFromMain = async ({ amount }: FundFromMainParams) => {
  await mockDelay();
  return mockRequest((s) => s.fundFromMain(amount));
};
