import { MetadataRoute } from "next";
import { Locale } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SERVICE_SLUGS, getLocalizedSlug } from "@/i18n/serviceSlugs";

/** Base URL for all sitemap entries. */
const host = "https://daniel-freire.com";

/**
 * Fixed lastModified dates for static pages.
 *
 * Instead of reporting every page as modified "today" (which dilutes the
 * signal for crawlers), we use realistic dates that reflect when each
 * section was last meaningfully updated.
 */
const LAST_MODIFIED: Record<string, string> = {
	"/": new Date().toISOString(),
	"/about": "2025-06-15T00:00:00.000Z",
	"/contact": "2025-05-20T00:00:00.000Z",
	"/portfolio": "2025-06-01T00:00:00.000Z",
	"/privacy-policy": "2025-03-10T00:00:00.000Z",
	"/services": "2025-06-15T00:00:00.000Z",
};

/** Fallback lastModified for dynamic entries (service detail pages). */
const SERVICE_LAST_MODIFIED = "2025-06-15T00:00:00.000Z";

/**
 * Priority mapping for static routes.
 *
 * Higher values tell crawlers which pages are most important relative to
 * other pages on the site (not to other sites).  Values range 0.0 – 1.0.
 */
const ROUTE_PRIORITY: Record<string, number> = {
	"/": 1.0,
	"/about": 0.7,
	"/contact": 0.8,
	"/portfolio": 0.8,
	"/privacy-policy": 0.3,
	"/services": 0.9,
};

/**
 * Change frequency mapping for static routes.
 *
 * Tells crawlers how often they should revisit each page.  Pages that
 * change infrequently (legal, about) use "monthly"; active content pages
 * use "weekly".
 */
const ROUTE_CHANGE_FREQ: Record<string, MetadataRoute.Sitemap[number]["changeFrequency"]> = {
	"/": "weekly",
	"/about": "monthly",
	"/contact": "monthly",
	"/portfolio": "weekly",
	"/privacy-policy": "monthly",
	"/services": "weekly",
};

/**
 * Generates the sitemap for search engines.
 *
 * Creates entries for each supported locale for the main pages (home, about,
 * contact, portfolio, privacy policy, services listing) and every individual
 * service detail page, including hreflang alternates so crawlers understand
 * the localized versions of each page. Each entry includes priority,
 * change frequency, and last modification date.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	return [
		...getEntries("/"),
		...getEntries("/about"),
		...getEntries("/contact"),
		...getEntries("/portfolio"),
		...getEntries("/privacy-policy"),
		...getEntries("/services"),
		...SERVICE_SLUGS.flatMap((englishSlug) => getDynamicEntries("/services/[slug]", englishSlug)),
	];
}

/** A valid route path that can be passed to `getPathname`. */
type Href = Parameters<typeof getPathname>[0]["href"];

/**
 * Creates sitemap entries for a given static route across all supported
 * locales, enriched with priority, change frequency, and lastModified.
 *
 * @param href - The route path (e.g., "/about").
 * @returns An array of sitemap entries, one per locale.
 */
/** OG image URL shared across all sitemap pages. */
const OG_IMAGE = "https://daniel-freire.com/metadata/open-graph-initials5.png";

function getEntries(href: Href) {
	const priority = ROUTE_PRIORITY[href as string] ?? 0.5;
	const changeFrequency = ROUTE_CHANGE_FREQ[href as string] ?? "monthly";
	const lastModified = LAST_MODIFIED[href as string] ?? new Date().toISOString();

	return routing.locales.map((locale) => ({
		url: getUrl(href, locale),
		lastModified,
		changeFrequency,
		priority,
		images: [OG_IMAGE],
		alternates: {
			languages: Object.fromEntries(routing.locales.map((cur) => [cur, getUrl(href, cur)])),
		},
	}));
}

/**
 * Creates sitemap entries for a dynamic route across all supported
 * locales, with enrichment fields.
 *
 * @param href   - The route pattern (e.g., "/services/[slug]").
 * @param params - The dynamic parameter values to substitute.
 * @returns An array of sitemap entries, one per locale.
 */
function getDynamicEntries(href: string, englishSlug: string) {
	return routing.locales.map((locale) => {
		const localizedSlug = getLocalizedSlug(englishSlug, locale);

		return {
			url: getDynamicUrl(href, { slug: localizedSlug }, locale),
			lastModified: SERVICE_LAST_MODIFIED,
			changeFrequency: "monthly" as const,
			priority: 0.7,
			images: [OG_IMAGE],
			alternates: {
				languages: Object.fromEntries(
					routing.locales.map((cur) => [cur, getDynamicUrl(href, { slug: getLocalizedSlug(englishSlug, cur) }, cur)]),
				),
			},
		};
	});
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
