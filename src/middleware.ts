import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Internationalization middleware that handles locale detection, negotiation,
 * and redirects based on the configured routing rules.
 *
 * Inspects the incoming request's headers (Accept-Language), cookies, and URL
 * path to determine the best matching locale, then redirects or rewrites
 * accordingly.
 */
export default createMiddleware(routing);

/**
 * Middleware matcher configuration.
 *
 * Only runs on page requests, excluding static assets, API routes, and
 * common file types (images, SVGs, favicon, sitemap, etc.) to avoid
 * unnecessary processing.
 */
export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|trpc|_next|_vercel|favicon.ico|.*/opengraph-image|sitemap.xml|.*\\.svg$|.*\\.png$|.*\\.webp$|.*\\.gif$|.*\\.txt$).*)",
	],
};
