import { MetadataRoute } from "next";
import { Locale } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SERVICE_SLUGS } from "@/lib/serviceSlugs";

/** Base URL for all sitemap entries. */
const host = "https://daniel-freire.com";

/**
 * Generates the sitemap for search engines.
 *
 * Creates entries for each supported locale for the main pages (home, about,
 * contact, portfolio, privacy policy, services listing) and every individual
 * service detail page, including hreflang alternates so crawlers understand
 * the localized versions of each page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	return [
		...getEntries("/"),
		...getEntries("/about"),
		...getEntries("/contact"),
		...getEntries("/portfolio"),
		...getEntries("/privacy-policy"),
		...getEntries("/services"),
		...SERVICE_SLUGS.flatMap((slug) =>
			getDynamicEntries("/services/[slug]", { slug }),
		),
	];
}

/** A valid route path that can be passed to `getPathname`. */
type Href = Parameters<typeof getPathname>[0]["href"];

/**
 * Creates sitemap entries for a given static route across all supported
 * locales.
 *
 * @param href - The route path (e.g., "/about").
 * @returns An array of sitemap entries, one per locale.
 */
function getEntries(href: Href) {
	return routing.locales.map((locale) => ({
		url: getUrl(href, locale),
		alternates: {
			languages: Object.fromEntries(routing.locales.map((cur) => [cur, getUrl(href, cur)])),
		},
	}));
}

/**
 * Creates sitemap entries for a dynamic route across all supported locales.
 *
 * @param href   - The route pattern (e.g., "/services/[slug]").
 * @param params - The dynamic parameter values to substitute.
 * @returns An array of sitemap entries, one per locale.
 */
function getDynamicEntries(href: string, params: Record<string, string>) {
	return routing.locales.map((locale) => ({
		url: getDynamicUrl(href, params, locale),
		alternates: {
			languages: Object.fromEntries(
				routing.locales.map((cur) => [cur, getDynamicUrl(href, params, cur)]),
			),
		},
	}));
}

/**
 * Builds the full URL for a given route and locale.
 *
 * @param href   - The route path.
 * @param locale - The target locale.
 * @returns The absolute URL (e.g., "https://daniel-freire.com/en/about").
 */
function getUrl(href: Href, locale: Locale) {
	const pathname = getPathname({ locale, href });
	return host + pathname;
}

/**
 * Builds the full URL for a dynamic route pattern with parameter values.
 *
 * Uses `getPathname` with an object-form `href` so that next-intl can
 * substitute the dynamic segment (e.g., `[slug]`) before applying the
 * locale-specific pathname mapping.
 *
 * @param href   - The route pattern (e.g., "/services/[slug]").
 * @param params - The dynamic parameter values to substitute.
 * @param locale - The target locale.
 * @returns The absolute URL (e.g., "https://daniel-freire.com/pt/servicos/software-personalizado-empresarial").
 */
function getDynamicUrl(href: string, params: Record<string, string>, locale: Locale) {
	const pathname = getPathname({
		locale,
		href: { pathname: href, params },
	} as Parameters<typeof getPathname>[0]);
	return host + pathname;
}
