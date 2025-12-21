import { create } from "zustand";
import type { User } from "../types/user";

export interface AuthStore {
  user?: User;
  setAuth: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: undefined,
  setAuth: (user: User) => {
    set({ user });
  },
  clearAuth: () => {
    set({ user: undefined });
  },
}));