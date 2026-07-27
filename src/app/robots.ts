import { MetadataRoute } from "next";

/**
 * Programmatic robots.txt generation.
 *
 * Dynamically generates robots rules, pointing crawlers to the sitemap and
 * allowing full access to all pages.  This supersedes the static
 * `src/app/robots.txt` file and integrates with Next.js metadata routing.
 *
 * The sitemap URL is the same for all locales because Next.js serves
 * `sitemap.xml` from the root regardless of locale.
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/api/", "/_next/", "/cdn-cgi/"],
		},
		sitemap: "https://daniel-freire.com/sitemap.xml",
	};
}
