import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  devnetBannerDismissed: boolean;
  roundUpAmount: 1 | 5 | 10;
  transactionPending: boolean;
  dismissDevnetBanner: () => void;
  setRoundUpAmount: (amount: 1 | 5 | 10) => void;
  setTransactionPending: (pending: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      devnetBannerDismissed: false,
      roundUpAmount: 1,
      transactionPending: false,
      dismissDevnetBanner: () => set({ devnetBannerDismissed: true }),
      setRoundUpAmount: (amount) => set({ roundUpAmount: amount }),
      setTransactionPending: (pending) => set({ transactionPending: pending }),
    }),
    {
      name: 'ororound-ui',
    }
  )
);
