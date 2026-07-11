/**
 * Canonical English slugs for every service offered.
 *
 * Shared between the sitemap and the dynamic service-detail route so the
 * master list of services lives in a single place.
 */
export const SERVICE_SLUGS = [
	"business-custom-software",
	"ai-solution-implementation",
	"web-development",
	"seo-technical-consulting",
] as const;

/** Union type derived from the canonical slug list. */
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];
