import { create } from "zustand";
import type { User } from "../types/user.types";

export interface AuthStore {
  isLoggedIn: boolean;
  user?: User;
  loginSuccess: () => void;
  loginFail: () => void;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  setUser: (user: User) => {
    set(() => ({
      user,
      isLoggedIn: true,
    }));
  },
  loginSuccess: () => {
    set(() => ({
      isLoggedIn: true,
    }));
  },
  loginFail: () => {
    set(() => ({
      isLoggedIn: false,
      user: undefined,
    }));
  },
  clearUser: () => {
    set(() => ({
      user: undefined,
      isLoggedIn: false,
    }));
  },
}));