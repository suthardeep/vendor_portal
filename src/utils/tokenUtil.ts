import { LocalStorageUtil } from "./localStorageUtil";

const TOKEN_KEY = "aavak-vendor-token";

export const TokenUtil = {
  setToken(token: string): void {
    LocalStorageUtil.setItem<string>(TOKEN_KEY, token);
  },

  getToken(): string | null {
    return LocalStorageUtil.getItem<string>(TOKEN_KEY);
  },

  hasToken(): boolean {
    return !!this.getToken();
  },

  removeToken(): void {
    LocalStorageUtil.removeItem(TOKEN_KEY);
  },

  clearToken(): void {
    this.removeToken();
  },
};
