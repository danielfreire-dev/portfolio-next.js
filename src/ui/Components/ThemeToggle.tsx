import { useEffect } from "react";
import { LineMdMoonFilledToSunnyFilledLoopTransition } from "./svgs/sun";
import { LineMdSunnyFilledLoopToMoonFilledLoopTransition } from "./svgs/moon";
import { useThemeStore } from "@/stores/theme-store";

/**
 * Dark/light theme toggle component.
 *
 * Renders a hidden checkbox that controls the theme state via Zustand.
 * Persists the user's preference to a cookie and falls back to the system
 * `prefers-color-scheme` media query when no saved preference exists.
 */
const ThemeToggle = () => {
  const { isDarkStore, setValue } = useThemeStore();

  /**
   * Retrieve the value of a named cookie from document.cookie.
   *
   * @returns The cookie value for the given name, or `null` if the cookie is not present or if `document` is unavailable (e.g., during SSR).
   */
  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null; // SSR safety

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  }

  /** Persists a cookie with the given name, value, and expiry in days. */
  function setCookie(name: string, value: string, days: number) {
    if (typeof document === "undefined") return; // SSR safety
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  }

  // Initialise theme from cookie or system preference on mount
  useEffect(() => {
    const savedTheme = getCookie("theme");
    if (savedTheme) {
      setValue(savedTheme === "dark");
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if (!savedTheme) {
      setValue(mediaQuery.matches);
    }

    const handleChange = (e: MediaQueryListEvent) => {
      // Only react to system changes when no explicit user preference is saved
      if (!getCookie("theme")) {
        setValue(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  /**
   * Update the theme from the toggle input and persist the user's preference to a cookie.
   *
   * @param e - Change event from the theme toggle checkbox; checked = dark theme when `true`
   */
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
