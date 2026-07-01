import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { LineMdMoonFilledToSunnyFilledLoopTransition } from "./svgs/sun";
import { LineMdSunnyFilledLoopToMoonFilledLoopTransition } from "./svgs/moon";
import { useThemeStore } from "@/stores/theme-store";

/** Key used to store the theme preference in localStorage. */
const THEME_KEY = "theme";

/**
 * Reads the persisted theme preference from localStorage.
 *
 * @returns The stored theme value, or `null` if no preference is saved
 *          or if `localStorage` is unavailable (e.g., during SSR).
 */
function getStoredTheme(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(THEME_KEY);
}

/**
 * Persists the theme preference to localStorage.
 *
 * @param value - The theme value to store.
 */
function setStoredTheme(value: string): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(THEME_KEY, value);
}

/**
 * Dark/light theme toggle component.
 *
 * Renders a hidden checkbox that controls the theme state via Zustand.
 * Persists the user's preference to localStorage and falls back to the
 * system `prefers-color-scheme` media query when no saved preference exists.
 */
const ThemeToggle = () => {
	const { isDarkStore, setValue } = useThemeStore();
	const t = useTranslations("svgTitles");

	// Initialise theme from localStorage or system preference on mount
	useEffect(() => {
		// Ensure transitions are enabled (the blocking script may have already set this)
		document.documentElement.classList.add("theme-ready");

		const savedTheme = getStoredTheme();
		if (savedTheme) {
			const isDark = savedTheme === "dark";
			setValue(isDark);
			document.documentElement.classList.toggle("dark", isDark);
			return;
		}

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		if (!savedTheme) {
			const isDark = mediaQuery.matches;
			setValue(isDark);
			document.documentElement.classList.toggle("dark", isDark);
		}

		const handleChange = (e: MediaQueryListEvent) => {
			// Only react to system changes when no explicit user preference is saved
			if (!getStoredTheme()) {
				setValue(e.matches);
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	/**
	 * Update the theme from the toggle input and persist the user's preference
	 * to localStorage.
	 *
	 * @param e - Change event from the theme toggle checkbox; checked = dark theme when `true`
	 */
	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const newTheme = e.target.checked;
		setValue(newTheme);

		// Sync the class on <html> so CSS selectors match immediately
		document.documentElement.classList.toggle("dark", newTheme);

		// Save preference to localStorage immediately
		setStoredTheme(newTheme ? "dark" : "light");

		// Set cookie so the server can render the correct theme on next request
		document.cookie = `theme=${newTheme ? "dark" : "light"};path=/;max-age=31536000;SameSite=Lax`;
	}

	return (
		<>
			<input
				type="checkbox"
				className="hidden appearance-none"
				id="theme-toggle"
				checked={isDarkStore}
				onChange={handleChange}
			/>
			<label
				className="toggle hover:cursor-pointer py-3 px-2"
				htmlFor="theme-toggle">
				<div>
					{isDarkStore ?
						<LineMdSunnyFilledLoopToMoonFilledLoopTransition title={t("sunToMoon")} />
					:	<LineMdMoonFilledToSunnyFilledLoopTransition title={t("moonToSun")} />}
				</div>
			</label>
		</>
	);
};

export default ThemeToggle;
