import { mockDelay } from '@/lib/mock-delay';
import { mockRequest } from '../mock-transport';
import type { CreateSignetPassParams, FundFromMainParams, SelectSignetPassParams } from './types';

export const getSignetPasses = () => mockRequest((s) => ({ passes: s.passes, selectedId: s.selectedPassId }));

export const createSignetPass = async (params: CreateSignetPassParams) => {
  await mockDelay();
  return mockRequest((s) => s.createSignetPass(params));
};

export const selectSignetPass = ({ id }: SelectSignetPassParams) => mockRequest((s) => s.selectPass(id));

export const fundFromMain = async ({ amount }: FundFromMainParams) => {
  await mockDelay();
  return mockRequest((s) => s.fundFromMain(amount));
};
