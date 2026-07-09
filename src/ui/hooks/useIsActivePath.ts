"use client";

import { usePathname } from "@/i18n/navigation";

/**
 * Normalises a URL path for reliable comparison.
 *
 * Decodes any percent-encoded characters, collapses repeated slashes,
 * and strips trailing slashes so paths that differ only in encoding
 * or formatting still match correctly.
 *
 * @param path - The raw path string.
 * @returns The normalised path.
 */
const normalizePath = (path: string) => {
	const decoded = decodeURIComponent(path);
	return decoded.replace(/\/+/g, "/").replace(/\/$/, "");
};

/**
 * Custom hook for locale-aware active-path detection.
 *
 * Uses the i18n-aware `usePathname` from `@/i18n/navigation`, which returns
 * the canonical (non-localized) path regardless of the current locale. This
 * means `/en/contact`, `/pt/contactos`, etc. all normalise to `/contact`.
 *
 * Returns an `isActive` function that accepts a target path and determines
 * whether the current URL matches it:
 *
 * - The home route (`"/"`) matches exactly `"/"` or `""`.
 * - Any other route matches either an exact path or a child route
 *   (via `startsWith(target + "/")`), preventing false positives like
 *   `/contact` matching `/contact-us`.
 *
 * @returns A function `(targetPath: string) => boolean` that checks if the
 *          given path matches the current URL.
 *
 * @example
 * ```tsx
 * const isActive = useIsActivePath();
 * isActive("/contact");     // true on /contact or /contact/anything
 * isActive("/");            // true only on the home page
 * isActive("/services");    // true on /services or /services/web-dev
 * ```
 */
export function useIsActivePath(): (targetPath: string) => boolean {
	const pathname = usePathname();

	/**
	 * Determines whether a given target path matches the current URL.
	 *
	 * Handles the home route as a special case and uses prefix matching
	 * (with a trailing slash guard) for all other routes so nested pages
	 * are correctly identified as children.
	 *
	 * @param targetPath - The canonical path to check against (e.g., `"/contact"`).
	 * @returns `true` if the current path matches or is a child of `targetPath`.
	 */
	const isActive = (targetPath: string): boolean => {
		const normalizedTarget = normalizePath(targetPath);
		const normalizedPath = normalizePath(pathname);

		// Home route: match exactly "/" or empty string
		if (targetPath === "/") {
			return normalizedPath === "/" || normalizedPath === "";
		}

		// Exact match or child route (prevents /contact matching /contact-us)
		return normalizedPath === normalizedTarget || normalizedPath.startsWith(`${normalizedTarget}/`);
	};

	return isActive;
}
