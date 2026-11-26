import { getLocalizedSlug, toEnglishSlug } from "./serviceSlugs";

/**
 * Builds the target for `router.replace()` when the visitor switches language
 * on the current page.
 *
 * `usePathname()` from next-intl returns the route template for dynamic pages
 * (e.g. `/services/[service]`). Passing that template alone makes next-intl
 * throw "Insufficient params provided for localized pathname", so the switch
 * silently did nothing on every service-detail page. Service pages need their
 * slug translated for the new locale, so pass the template together with the
 * localized slug.
 *
 * @param pathname - The route template from next-intl's `usePathname()`.
 * @param params - The current route params from `useParams()`.
 * @param nextLocale - The locale being switched to.
 */
export function switchLocaleHref(
	pathname: string,
	params: Record<string, string | string[] | undefined>,
	nextLocale: string,
): string | { pathname: string; params: Record<string, string> } {
	if (pathname === "/services/[service]" && typeof params.service === "string") {
		return {
			pathname,
			params: { service: getLocalizedSlug(toEnglishSlug(params.service), nextLocale) },
		};
	}
	return pathname;
}
