import { usePassportStore } from '@/stores/passport-store';

type MockStore = ReturnType<typeof usePassportStore.getState>;

/** Mock transport: reads and writes the persisted demo store the way a backend would. Swap for httpInstance later. */
export const mockRequest = <T>(run: (store: MockStore) => T): Promise<T> => Promise.resolve().then(() => run(usePassportStore.getState()));

/** Records that belong to the selected SignetPass, as a backend scoped by pass would return them. */
export const forSelectedPass = <T extends { passId: string }>(s: MockStore, items: T[]) => items.filter((x) => x.passId === s.selectedPassId);
