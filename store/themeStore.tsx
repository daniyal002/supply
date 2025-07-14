import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface IThemeStore {
  supplyTheme: "dark" | "light";
  setSupplyTheme: (supplyTheme: "dark" | "light") => void;
}

export const useThemeStore = create<IThemeStore>()(
  devtools(
    (set, get) => ({
      supplyTheme: "light",
      setSupplyTheme(supplyTheme) {
        set({ supplyTheme });
      },
    }),
    { name: "themeStore" }
  ) // Укажите имя для devtools
);
