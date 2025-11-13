import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const updateHtmlClass = (theme: Theme) => {
  if (typeof document !== "undefined") {
    const htmlElement = document.documentElement;

    if (theme === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }
};

const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme:
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",

      setTheme: (theme: Theme) => {
        updateHtmlClass(theme);
        set({ theme });
      },

      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light";
        updateHtmlClass(newTheme);
        set({ theme: newTheme });
      },
    }),
    {
      name: "fb-admin-theme",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) updateHtmlClass(state.theme);
      },
    }
  )
);

export const useThemeInit = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    updateHtmlClass(theme);
  }, [theme]);
};

export default useThemeStore;