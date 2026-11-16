import { mockDelay } from '@/lib/mock-delay';
import { currentMainWallet } from '@/stores/passport-store';
import { mockRequest } from '../mock-transport';
import type { MainWalletView, SendFromMainParams } from './types';

export const getMainWallet = () =>
  mockRequest(
    (s): MainWalletView => ({
      address: s.context.address,
      network: s.context.network,
      balance: currentMainWallet(s)?.balance ?? 0,
      transactions: currentMainWallet(s)?.transactions ?? [],
    })
  );

export const sendFromMain = async ({ to, amount }: SendFromMainParams) => {
  await mockDelay();
  return mockRequest((s) => s.sendFromMain(to, amount));
};
