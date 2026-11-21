import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/** Base URL for all hreflang and canonical URLs. */
export const BASE_URL = "https://daniel-freire.com";

/**
 * A valid route href accepted by `getPathname`.
 *
 * Can be a simple string for static routes (e.g., `"/about"`) or an object
 * with `pathname` and `params` for dynamic routes (e.g.,
 * `{ pathname: "/services/[service]", params: { service: "web-development" } }`).
 */
type Href = Parameters<typeof getPathname>[0]["href"];

/**
 * Returns the absolute, localized canonical URL for a route.
 *
 * Resolves localized pathnames (e.g. `/about` → `/pt/sobre`) so that every
 * URL emitted in metadata or structured data points at the final,
 * non-redirecting address.
 *
 * @example
 * getCanonicalUrl("/about", "pt"); // → "https://daniel-freire.com/pt/sobre"
 */
export function getCanonicalUrl(href: Href, locale: string): string {
	return `${BASE_URL}${getPathname({ locale, href } as Parameters<typeof getPathname>[0])}`;
}

/**
 * Options for {@link getAlternates}.
 */
export interface GetAlternatesOptions {
	/** The canonical route href (static string or dynamic object with params). */
	href: Href;
	/** The current page locale. */
	locale: string;
	/**
	 * Optional: if provided, called for each locale to produce a
	 * locale-specific href.  Useful for dynamic routes where route params
	 * (e.g., service slugs) differ per locale.  When omitted, the base
	 * `href` is used for every locale.
	 *
	 * @example
	 * // Dynamic route with translated slugs
	 * hrefForLocale: (cur) => ({
	 *   pathname: "/services/[service]",
	 *   params: { service: getLocalizedSlug(englishSlug, cur) },
	 * })
	 */
	hrefForLocale?: (locale: string) => Href;
}

/**
 * Builds the `Metadata.alternates` object for a given route and locale.
 *
 * Generates:
 * - A canonical URL for the current locale
 * - Language alternates (hreflang) for **every** supported locale
 * - An `x-default` hreflang pointing to the English version (for unmatched
 *   language preferences)
 *
 * All URLs are fully qualified absolute URLs (e.g.,
 * `https://daniel-freire.com/pt/sobre`).
 *
 * @example
 * // Static route
 * getAlternates({ href: "/about", locale: "pt" });
 * // → { canonical: "/pt/sobre", languages: { en: "https://...", pt: "https://...", ... } }
 *
 * @example
 * // Dynamic route
 * getAlternates({
 *   href: { pathname: "/services/[service]", params: { service: "web-development" } },
 *   locale: "pt",
 * });
 *
 * @param options - The route href and current locale.
 * @returns A `Metadata.alternates` object ready for `generateMetadata`.
 */
export function getAlternates({
	href,
	locale,
	hrefForLocale,
}: GetAlternatesOptions): NonNullable<Metadata["alternates"]> {
	const languages: Record<string, string> = Object.fromEntries(
		routing.locales.map((cur) => [cur, getCanonicalUrl(hrefForLocale ? hrefForLocale(cur) : href, cur)]),
	);

	// x-default: for users whose language preference doesn't match any
	// supported locale, fall back to the English version.
	languages["x-default"] = getCanonicalUrl(hrefForLocale ? hrefForLocale("en") : href, "en");

	return {
		canonical: getCanonicalUrl(href, locale),
		languages,
	};
}
