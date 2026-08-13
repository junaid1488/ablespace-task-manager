'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isHydrated: boolean;

  setAuth: (accessToken: string, user: User) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isHydrated: false,

      // Set authentication and mark the store as ready.
      setAuth: (accessToken, user) =>
        set({
          accessToken,
          user,
          isHydrated: true,
        }),

      updateUser: (partial) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...partial }
            : state.user,
        })),

      // Clear authentication but keep the store hydrated.
      logout: () =>
        set({
          accessToken: null,
          user: null,
          isHydrated: true,
        }),

      setHydrated: () =>
        set({
          isHydrated: true,
        }),
    }),
    {
      name: 'ablespace-auth',

      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);