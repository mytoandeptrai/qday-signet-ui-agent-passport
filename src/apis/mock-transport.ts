import { usePassportStore } from '@/stores/passport-store';

/** Mock transport: reads and writes the persisted demo store the way a backend would. Swap for httpInstance later. */
export const mockRequest = <T>(run: (store: ReturnType<typeof usePassportStore.getState>) => T): Promise<T> =>
  Promise.resolve().then(() => run(usePassportStore.getState()));
