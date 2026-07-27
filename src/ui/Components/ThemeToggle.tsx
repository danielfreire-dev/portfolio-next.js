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
 * On mount, reads the persisted preference from localStorage; if none
 * exists, falls back to the system `prefers-color-scheme` media query
 * and listens for OS-level changes so the theme stays in sync.
 *
 * When toggled, the component immediately writes the choice to three
 * places to eliminate any flash of incorrect theme (FOUC):
 *   1. Zustand store (in-memory, instant)
 *   2. `document.documentElement.classList` (CSS selectors)
 *   3. `localStorage` + a `theme` cookie (survives page reloads and
 *      lets the blocking script in `layout.tsx` apply the correct
 *      class before the first paint)
 */
const ThemeToggle = () => {
	const { isDarkStore, setValue } = useThemeStore();
	const t = useTranslations("svgTitles");

	useEffect(() => {
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
			if (!getStoredTheme()) {
				setValue(e.matches);
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	/**
	 * Updates the theme from the toggle input and persists the user's
	 * preference across localStorage, a cookie, and the Zustand store.
	 *
	 * Writing to all three sinks simultaneously ensures the theme is
	 * applied instantly (CSS class toggle), survives page reloads
	 * (cookie for SSR + localStorage for client hydration), and stays
	 * consistent across concurrent tabs (localStorage is per-origin).
	 *
	 * @param e - Change event from the theme toggle checkbox; checked
	 *            means dark theme is active.
	 */
	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const newTheme = e.target.checked;
		setValue(newTheme);

		document.documentElement.classList.toggle("dark", newTheme);

		setStoredTheme(newTheme ? "dark" : "light");

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
