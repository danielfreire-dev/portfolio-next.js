import { MetadataRoute } from "next";
import { Locale } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

/** Base URL for all sitemap entries. */
const host = "https://daniel-freire.com";

/**
 * Generates the sitemap for search engines.
 *
 * Creates entries for each supported locale for the main pages (home, about,
 * contact, portfolio, privacy policy), including hreflang alternates so
 * crawlers understand the localized versions of each page.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...getEntries("/"),
    ...getEntries("/about"),
    ...getEntries("/contact"),
    ...getEntries("/portfolio"),
    ...getEntries("/privacy-policy"),
  ];
}

/** A valid route path that can be passed to `getPathname`. */
type Href = Parameters<typeof getPathname>[0]["href"];

/**
 * Creates sitemap entries for a given route across all supported locales.
 *
 * @param href - The route path (e.g., "/about").
 * @returns An array of sitemap entries, one per locale.
 */
function getEntries(href: Href) {
  return routing.locales.map((locale) => ({
    url: getUrl(href, locale),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((cur) => [cur, getUrl(href, cur)]),
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
