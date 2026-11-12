import { create } from 'zustand';

// 'opening' while the SDK loads and the URL is signed, 'open' once the MoonPay overlay shows.
export type MoonPayBuyStatus = 'idle' | 'opening' | 'open';

type MoonPayBuyStore = {
  status: MoonPayBuyStatus;
  walletAddress?: string;
  start: (walletAddress: string) => void;
  ready: () => void;
  stop: () => void;
};

// Lives outside any dialog: the overlay has to outlast the Add funds dialog that starts it.
export const useMoonPayBuyStore = create<MoonPayBuyStore>()((set) => ({
  status: 'idle',
  start: (walletAddress) => set({ status: 'opening', walletAddress }),
  ready: () => set({ status: 'open' }),
  stop: () => set({ status: 'idle', walletAddress: undefined }),
}));
