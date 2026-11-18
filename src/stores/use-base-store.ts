import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Currency = {
  code: string;
  symbol: string;
  locale: string;
  decimalPlaces: number;
};

export type CurrencyStoreState = {
  currency: Currency;
};

export type CurrencyStoreActions = {
  setCurrency: (currency: Currency) => void;
  reset: () => void;
};

export type CurrencyStore = CurrencyStoreState & CurrencyStoreActions;

export const DEFAULT_CURRENCY: Currency = {
  code: 'USD',
  symbol: '$',
  locale: 'en-US',
  decimalPlaces: 2,
};

export const DEFAULT_CURRENCY_STORE_STATE: CurrencyStoreState = {
  currency: DEFAULT_CURRENCY,
};

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      ...DEFAULT_CURRENCY_STORE_STATE,

      setCurrency: (currency: Currency) => set({ currency }),

      reset: () => set(DEFAULT_CURRENCY_STORE_STATE),
    }),
    {
      name: '__currency_storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
