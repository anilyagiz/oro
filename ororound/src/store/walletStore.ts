import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  publicKey: string | null;
  connected: boolean;
  connecting: boolean;
  balance: number | null;
  setPublicKey: (key: string | null) => void;
  setConnected: (connected: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  setBalance: (balance: number | null) => void;
  reset: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      publicKey: null,
      connected: false,
      connecting: false,
      balance: null,
      setPublicKey: (key) => set({ publicKey: key }),
      setConnected: (connected) => set({ connected }),
      setConnecting: (connecting) => set({ connecting }),
      setBalance: (balance) => set({ balance }),
      reset: () =>
        set({
          publicKey: null,
          connected: false,
          connecting: false,
          balance: null,
        }),
    }),
    {
      name: 'ororound-wallet',
      partialize: (state) => ({ publicKey: state.publicKey }),
    }
  )
);
