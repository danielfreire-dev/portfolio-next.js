import { create } from "zustand";

export type ThemeState = {
	isDarkStore: boolean;
};

export type ThemeActions = {
	toggleTheme: () => void;
	setValue: (value: boolean) => void;
};

export type ThemeStore = ThemeState & ThemeActions;

export const useThemeStore = create<ThemeStore>((set) => ({
	isDarkStore: false,
	toggleTheme: () => set((state) => ({ isDarkStore: !state.isDarkStore })),
	setValue: (value) => set({ isDarkStore: value }),
}));
