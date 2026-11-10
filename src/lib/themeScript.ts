/**
 * Blocking inline script that applies the `dark` class before first paint.
 *
 * Reads the persisted preference from localStorage (written by ThemeToggle),
 * falling back to the OS `prefers-color-scheme` setting, then marks the
 * document as `theme-ready` so theme transitions can be enabled safely.
 *
 * Shared by the localized root layout and the root not-found page, which
 * each render their own `<html>` element.
 */
export const themeScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("theme");var isDark=t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(isDark){d.classList.add("dark")}else{d.classList.remove("dark")}d.classList.add("theme-ready")}catch(e){document.documentElement.classList.add("theme-ready")}})();`;
