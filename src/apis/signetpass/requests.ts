import { mockDelay } from '@/lib/mock-delay';
import { selectedPass, visiblePasses } from '@/stores/passport-store';
import { mockRequest } from '../mock-transport';
import type {
  ActivateSignetPassParams,
  CreateSignetPassParams,
  FundFromMainParams,
  GetInstallCodeParams,
  RenameSignetPassParams,
  SelectSignetPassParams,
} from './types';

/** Passes of the connected account on the network in use, and which one the app screens follow. */
export const getSignetPasses = () => mockRequest((s) => ({ passes: visiblePasses(s), selectedId: selectedPass(s)?.id ?? null }));

export const getSignetPass = (id: string) => mockRequest((s) => visiblePasses(s).find((p) => p.id === id) ?? null);

export const createSignetPass = async (params: CreateSignetPassParams) => {
  await mockDelay();
  return mockRequest((s) => s.createSignetPass(params));
};

export const activateSignetPass = async ({ id }: ActivateSignetPassParams) => {
  await mockDelay();
  return mockRequest((s) => s.activateSignetPass(id));
};

export const renameSignetPass = async ({ id, name }: RenameSignetPassParams) => {
  await mockDelay();
  return mockRequest((s) => s.renamePass(id, name));
};

export const selectSignetPass = ({ id }: SelectSignetPassParams) => mockRequest((s) => s.selectPass(id));

export const fundFromMain = async ({ amount }: FundFromMainParams) => {
  await mockDelay();
  return mockRequest((s) => s.fundFromMain(amount));
};

/** The one-time code that links a CLI install to an active SignetPass. Only an active pass can get one. */
export const getInstallCode = async ({ passId }: GetInstallCodeParams) => {
  await mockDelay();
  return mockRequest((s) => {
    if (visiblePasses(s).find((p) => p.id === passId)?.status !== 'active') throw new Error('SignetPass is not active');
    return { code: `SGN-${Math.random().toString(36).slice(2, 10).toUpperCase()}` };
  });
};
