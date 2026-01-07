import { useEffect } from "react";
import { LineMdMoonFilledToSunnyFilledLoopTransition } from "./svgs/sun";
import { LineMdSunnyFilledLoopToMoonFilledLoopTransition } from "./svgs/moon";
import { useThemeStore } from "@/stores/theme-store";

const ThemeToggle = () => {


	const { isDarkStore, setValue } = useThemeStore();

	// Helper function to get cookie value
	function getCookie(name: string): string | null {
		if (typeof document === "undefined") return null; // SSR safety

		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) {
			return parts.pop()?.split(";").shift() || null;
		}
		return null;
	}

	// Helper function to set cookie
	function setCookie(name: string, value: string, days: number) {
		if (typeof document === "undefined") return; // SSR safety
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		const expires = `expires=${date.toUTCString()}`;
		document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
	}

	useEffect(() => {
		// Always check for saved theme preference on every render
		const savedTheme = getCookie("theme");
		if (savedTheme) {
			setValue(savedTheme === "dark");
			return;
		}

		// Only use system preference if no cookie exists
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		if (!savedTheme) {
			setValue(mediaQuery.matches);
		}

		const handleChange = (e: MediaQueryListEvent) => {
			// Only update based on system preference if no user preference is saved
			if (!getCookie("theme")) {
				setValue(e.matches);
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []); /* Removed dependency array to run on every render */

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const newTheme = e.target.checked;
		setValue(newTheme);

		// Save preference to cookies immediately
		setCookie("theme", newTheme ? "dark" : "light", 365);
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
				htmlFor="theme-toggle"
			>
				<div>
					{isDarkStore ? (
						<LineMdSunnyFilledLoopToMoonFilledLoopTransition />
					) : (
						<LineMdMoonFilledToSunnyFilledLoopTransition />
					)}
				</div>
			</label>
		</>
	);
};

export default ThemeToggle;
