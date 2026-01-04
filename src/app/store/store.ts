import { create } from "zustand";

interface ThemeStoreType {
	theme: "light" | "dark" | "";
	setTheme: (theme: "light" | "dark") => void;
	checkCookies: (isDark: boolean) => void;
	setCookies: () => void;
	isDark: boolean;
}

export const useThemeStore = create<ThemeStoreType>((set) => ({
	theme: "",
	isDark: true,
	setTheme: (theme) => set({ theme }),
	checkCookies: (isDark: boolean) => {
		// This function should only be called on the client side
		if (typeof document === "undefined") return;

		// Client-side cookie access
		const getCookie = (name: string): string | null => {
			const value = `; ${document.cookie}`;
			const parts = value.split(`; ${name}=`);
			if (parts.length === 2) {
				return parts.pop()?.split(";").shift() || null;
			}
			return null;
		};

		const theme = getCookie("theme");
		if (theme === "light") {
			set({ theme });
			isDark = false;
		}
	},
	setCookies: () => {
		const getCookie = (name: string): string | null => {
			const value = `; ${document.cookie}`;
			const parts = value.split(`; ${name}=`);
			if (parts.length === 2) {
				return parts.pop()?.split(";").shift() || null;
			}
			return null;
		};

		const savedTheme = getCookie("theme");
		if (savedTheme) {
			setIsDark(savedTheme === "dark");
			return;
		}

		// Only use system preference if no cookie exists
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		if (!savedTheme) {
			setIsDark(mediaQuery.matches);
		}

		const handleChange = (e: MediaQueryListEvent) => {
			// Only update based on system preference if no user preference is saved
			if (!getCookie("theme")) {
				setIsDark(e.matches);
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	},
}));
