import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { toEnglishSlug, getLocalizedSlug } from "./i18n/serviceSlugs";

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
 * Performs three tasks in sequence:
 *
 * 1. **www → non-www redirect** — If the request hostname starts with "www.",
 *    issues a 308 (permanent) redirect to the bare domain.  This ensures the
 *    sitemap, canonical tags, and hreflang alternates (all of which reference
 *    `https://daniel-freire.com`) are authoritative.  Running *before* the
 *    next-intl middleware guarantees the locale negotiator always sees the
 *    canonical domain, avoiding redirect loops.
 *
 * 2. **Canonical slug redirect** — For service-detail pages (e.g.,
 *    `/en/services/:slug`), normalizes the slug to the correct localized
 *    form for the requested locale.  If a visitor lands on
 *    `/en/services/skraeddersyet-forretningssoftware` (Danish slug on an
 *    English URL), they are 308-redirected to
 *    `/en/services/business-custom-software`.  Handles stale bookmarks,
 *    crawler-cached URLs, and cross-locale "hybrid" links.
 *
 * 3. **Locale detection & negotiation** — Delegates to next-intl's
 *    `createMiddleware` which inspects Accept-Language headers, cookies, and
 *    URL path to determine the best matching locale, then redirects or
 *    rewrites accordingly.
 */
const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
	// Redirect www → non-www (canonical domain)
	const hostname = req.headers.get("host") || "";
	if (hostname.startsWith("www.")) {
		const url = req.nextUrl.clone();
		url.hostname = hostname.slice(4); // strip "www." prefix
		return NextResponse.redirect(url, { status: 308 });
	}

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

	return intlMiddleware(req);
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
		"/((?!api|_next/static|_next/image|trpc|_next|_vercel|favicon.ico|.*/opengraph-image|llms.txt|sitemap.xml|.*\\.svg$|.*\\.png$|.*\\.webp$|.*\\.gif$|.*\\.txt$).*)",
	],
};
