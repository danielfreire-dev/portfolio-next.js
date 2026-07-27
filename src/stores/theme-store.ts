import { create } from "zustand";

/** Theme state shape: tracks whether the dark mode is active. */
export type ThemeState = {
  /** Whether the dark theme is currently enabled. */
  isDarkStore: boolean;
};

/** Actions available on the theme store. */
export type ThemeActions = {
  /** Toggles between dark and light themes. */
  toggleTheme: () => void;
  /** Explicitly sets the dark mode state. */
  setValue: (value: boolean) => void;
};

/** Combined type for the Zustand theme store. */
export type ThemeStore = ThemeState & ThemeActions;

/**
 * Global theme store powered by Zustand.
 *
 * Persists the dark/light mode preference in memory. The initial value is
 * `false` (light mode); consumers should sync this with the user's system
 * preference or a persisted cookie on mount.
 */
export const useThemeStore = create<ThemeStore>((set) => ({
  isDarkStore: false,
  toggleTheme: () => set((state) => ({ isDarkStore: !state.isDarkStore })),
  setValue: (value) => set({ isDarkStore: value }),
}));
