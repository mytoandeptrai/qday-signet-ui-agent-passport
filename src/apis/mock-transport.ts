import { selectedPass, usePassportStore } from '@/stores/passport-store';

type MockStore = ReturnType<typeof usePassportStore.getState>;

export const mockRequest = <T>(run: (store: MockStore) => T): Promise<T> => Promise.resolve().then(() => run(usePassportStore.getState()));

export const forSelectedPass = <T extends { passId: string }>(s: MockStore, items: T[]) => items.filter((x) => x.passId === selectedPass(s)?.id);
