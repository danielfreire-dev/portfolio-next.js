import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { toEnglishSlug, getLocalizedSlug, getAllLocalizedSlugs } from "./i18n/serviceSlugs";

/**
 * Set of all localized "services" path segments (without leading slash).
 *
 * Built from the routing configuration so the canonical slug redirect can
 * reliably detect service-detail pages regardless of locale.  The English
 * default `"services"` is added explicitly since `routing.pathnames` only
 * contains per-locale overrides for non-English locales.
 */
const servicesPathConfig = routing.pathnames["/services"];
const LOCALIZED_SERVICES_PATHS: Set<string> = new Set(
	typeof servicesPathConfig === "object" ?
		Object.values(servicesPathConfig).map((p) => (p as string).replace(/^\//, ""))
	:	[],
);
LOCALIZED_SERVICES_PATHS.add("services"); // English default

/**
 * Internationalization middleware.
 *
 * Performs two tasks in sequence:
 *
 * 1. **Canonical slug redirect** — For service-detail pages (e.g.,
 *    `/en/services/:slug`), normalizes the slug to the correct localized
 *    form for the requested locale.  If a visitor lands on
 *    `/en/services/skraeddersyet-forretningssoftware` (Danish slug on an
 *    English URL), they are 308-redirected to
 *    `/en/services/business-custom-software`.  Handles stale bookmarks,
 *    crawler-cached URLs, and cross-locale "hybrid" links.
 *
 * 2. **Locale detection & negotiation** — Delegates to next-intl's
 *    `createMiddleware` which inspects Accept-Language headers, cookies, and
 *    URL path to determine the best matching locale, then redirects or
 *    rewrites accordingly.
 *
 * Note: www → non-www redirect is handled by `next.config.ts` redirects,
 * which run *after* this middleware.  Keeping them separate avoids redirect
 * loops between the middleware and Vercel's edge-level domain redirect.
 */
const intlMiddleware = createMiddleware(routing);

/**
 * Internal path of the pre-rendered "page not found" route
 * (`src/app/[locale]/not-found-page`).  Unknown URLs are rewritten to it with
 * a 404 status.
 *
 * Why not just `notFound()`?  In Next.js 15 a `notFound()` thrown while
 * rendering a dynamic route sends the 404 status with an empty HTML shell and
 * renders the not-found UI in the browser only (nextjs.org itself behaves this
 * way).  A rewrite to a normal page keeps the 404 status *and* server-renders
 * the localized page inside the site layout.
 */
export const NOT_FOUND_PATH = "/not-found-page";

/** Route keys (from `routing.pathnames`) that have an actual page. */
const PAGE_ROUTES = ["/about", "/contact", "/portfolio", "/privacy-policy", "/services"] as const;

/** Files served under a locale prefix by metadata routes (e.g. `[locale]/manifest.ts`). */
const LOCALE_FILES = new Set(["manifest.webmanifest"]);

/** Every service slug in every locale (slug mismatches are redirected above). */
const ALL_SERVICE_SLUGS = new Set(getAllLocalizedSlugs());

/** Returns the localized pathname of a route key for `locale` (e.g. "/about" → "/sobre"). */
function localizedPath(key: keyof typeof routing.pathnames, locale: string): string {
	const config = routing.pathnames[key];
	return typeof config === "string" ? config : ((config as Record<string, string>)[locale] ?? key);
}

/**
 * Paths (without the locale prefix) that resolve to a page for each locale:
 * the localized pathname plus the internal key, which next-intl redirects to
 * the localized one (e.g. `/pt/about` → `/pt/sobre`).
 */
const KNOWN_PATHS: Record<string, Set<string>> = Object.fromEntries(
	routing.locales.map((locale) => [
		locale,
		new Set(PAGE_ROUTES.flatMap((key) => [key, localizedPath(key, locale)])),
	]),
);

/**
 * Whether `/{locale}/{rest...}` matches a real page.
 *
 * @param locale - A supported locale (first URL segment).
 * @param rest   - The remaining URL segments.
 */
export function isKnownLocalizedPath(locale: string, rest: string[]): boolean {
	if (rest.length === 0) return true; // home
	if (rest.length === 1 && LOCALE_FILES.has(rest[0])) return true;
	const known = KNOWN_PATHS[locale];
	if (!known) return false;
	if (rest.length === 1) return known.has(`/${rest[0]}`);
	if (rest.length === 2) return known.has(`/${rest[0]}`) && isServicesSegment(rest[0], locale) && ALL_SERVICE_SLUGS.has(rest[1]);
	return false;
}

/** Whether `segment` is the services listing path for `locale` (localized or internal key). */
function isServicesSegment(segment: string, locale: string): boolean {
	return segment === "services" || `/${segment}` === localizedPath("/services", locale);
}

export default function middleware(req: NextRequest) {
	// Canonical slug redirect for service-detail pages.
	// Extracts the slug from the URL, normalizes it through the
	// English-canonical round-trip (toEnglishSlug → getLocalizedSlug),
	// and redirects if the URL slug doesn't match the canonical form
	// for the requested locale.
	const pathname = req.nextUrl.pathname;
	const segments = pathname.split("/").filter(Boolean);
	// Expected shape: [locale, localized-services-path, slug]

	if (segments.length === 3) {
		const [urlLocale, urlServicesPath, urlSlug] = segments;

		if ((routing.locales as readonly string[]).includes(urlLocale) && LOCALIZED_SERVICES_PATHS.has(urlServicesPath)) {
			const englishSlug = toEnglishSlug(urlSlug);
			const canonicalSlug = getLocalizedSlug(englishSlug, urlLocale);

			if (canonicalSlug !== urlSlug) {
				const url = req.nextUrl.clone();
				url.pathname = `/${urlLocale}/${urlServicesPath}/${canonicalSlug}`;
				return NextResponse.redirect(url, { status: 308 });
			}
		}
	}

	// Unknown URL under a valid locale → server-rendered localized 404 page.
	if (segments.length > 0 && (routing.locales as readonly string[]).includes(segments[0])) {
		const [locale, ...rest] = segments;
		if (!isKnownLocalizedPath(locale, rest.map(safeDecode))) {
			const url = req.nextUrl.clone();
			url.pathname = `/${locale}${NOT_FOUND_PATH}`;
			return NextResponse.rewrite(url, { status: 404 });
		}
	}

	return intlMiddleware(req);
}

/** Decodes a URL segment, returning it unchanged if it is malformed. */
function safeDecode(segment: string): string {
	try {
		return decodeURIComponent(segment);
	} catch {
		return segment;
	}
}

/**
 * Middleware matcher configuration.
 *
 * Only runs on page requests, excluding static assets, API routes, and
 * common file types (images, SVGs, favicon, sitemap, etc.) to avoid
 * unnecessary processing.
 */
export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|trpc|_next|_vercel|favicon.ico|.*/opengraph-image|llms.txt|sitemap.xml|.*\\.svg$|.*\\.png$|.*\\.webp$|.*\\.gif$|.*\\.jpe?g$|.*\\.txt$).*)",
	],
};
