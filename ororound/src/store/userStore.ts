import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  kycHash: string | null;
  grailUserId: string | null;
  createdAt: string | null;
  setKycHash: (hash: string | null) => void;
  setGrailUserId: (id: string | null) => void;
  setCreatedAt: (date: string | null) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      kycHash: null,
      grailUserId: null,
      createdAt: null,
      setKycHash: (hash) => set({ kycHash: hash }),
      setGrailUserId: (id) => set({ grailUserId: id }),
      setCreatedAt: (date) => set({ createdAt: date }),
      reset: () =>
        set({
          kycHash: null,
          grailUserId: null,
          createdAt: null,
        }),
    }),
    {
      name: 'ororound-user',
    }
  )
);
