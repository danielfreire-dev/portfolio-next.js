import { MetadataRoute } from "next";
import { Locale } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SERVICE_SLUGS, getLocalizedSlug } from "@/i18n/serviceSlugs";
import { getAlternates } from "@/i18n/alternates";

/** Base URL for all sitemap entries. */
const host = "https://daniel-freire.com";

/**
 * Last *meaningful* content change for each page.
 *
 * Google only trusts `lastmod` when it is consistently accurate, so these
 * are fixed dates — never the build time.  **Update the date when a page's
 * visible content changes** (copy, sections, projects), not for refactors,
 * styling or metadata-only changes.
 */
const LAST_MODIFIED: Record<string, string> = {
	"/": "2026-11-19T00:00:00.000Z", // tech stack moved to About, new H1
	"/about": "2026-11-19T00:00:00.000Z", // tech stack section added
	"/contact": "2026-11-10T00:00:00.000Z", // contact form update
	"/portfolio": "2026-07-15T00:00:00.000Z", // project list update
	"/services": "2026-11-19T00:00:00.000Z", // intro + process section added
};

/** Last meaningful change for the service detail pages (cross-links added). */
const SERVICE_LAST_MODIFIED = "2026-11-19T00:00:00.000Z";

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
	"/services": "weekly",
};

/**
 * Generates the sitemap for search engines.
 *
 * Creates entries for each supported locale for the main pages (home, about,
 * contact, portfolio, services listing) and every individual service detail
 * page, including hreflang alternates so crawlers understand the localized
 * versions of each page. Each entry includes priority, change frequency, and
 * last modification date.
 *
 * Only indexable URLs belong here: the privacy policy is `noindex`, so it is
 * deliberately left out.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	return [
		...getEntries("/"),
		...getEntries("/about"),
		...getEntries("/contact"),
		...getEntries("/portfolio"),
		...getEntries("/services"),
		...SERVICE_SLUGS.flatMap((englishSlug) => getDynamicEntries("/services/[service]", englishSlug)),
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
	const lastModified = LAST_MODIFIED[href as string] ?? SERVICE_LAST_MODIFIED;

	return routing.locales.map((locale) => ({
		url: getUrl(href, locale),
		lastModified,
		changeFrequency,
		priority,
		alternates: {
			languages: Object.fromEntries(routing.locales.map((cur) => [cur, getUrl(href, cur)])),
		},
	}));
}

/**
 * Creates sitemap entries for a dynamic route across all supported
 * locales, with enrichment fields.
 *
 * Uses the shared {@link getAlternates} helper (the same one relied on by
 * the service-detail page's `generateMetadata`) so that sitemap URLs are
 * always consistent with the canonical & hreflang tags served on each page.
 *
 * @param href        - The route pattern (e.g., "/services/[service]").
 * @param englishSlug - The canonical English slug for the service.
 * @returns An array of sitemap entries, one per locale.
 */
function getDynamicEntries(href: "/services/[service]", englishSlug: string) {
	return routing.locales.map((locale) => {
		const localizedSlug = getLocalizedSlug(englishSlug, locale);

		const alternates = getAlternates({
			href: { pathname: href, params: { service: localizedSlug } },
			locale,
			hrefForLocale: (cur) => ({
				pathname: href,
				params: { service: getLocalizedSlug(englishSlug, cur) },
			}),
		});

		return {
			url: String(alternates.canonical),
			lastModified: SERVICE_LAST_MODIFIED,
			changeFrequency: "monthly" as const,
			priority: 0.7,
			alternates: {
				languages: alternates.languages as Record<string, string>,
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
