import { mockDelay } from '@/lib/mock-delay';
import { mockRequest } from '../mock-transport';
import type { SendFromMainParams } from './types';

export const getMainWallet = () => mockRequest((s) => s.mainWallet);

export const sendFromMain = async ({ to, amount }: SendFromMainParams) => {
  await mockDelay();
  return mockRequest((s) => s.sendFromMain(to, amount));
};
