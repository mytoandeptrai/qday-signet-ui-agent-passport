import { sleep } from '@/utils/common';
import { mockRequest } from '../mock-transport';
import type { CreateDepositParams } from './types';

export const getDepositList = () => mockRequest((s) => s.deposits);
// Simulated payment-processing latency.
export const createDeposit = async ({ amount, method }: CreateDepositParams) => {
  await sleep(900);
  return mockRequest((s) => s.deposit(amount, method));
};
