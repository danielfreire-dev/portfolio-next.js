import { SERVICE_SLUGS } from "@/lib/serviceSlugs";

// ---------------------------------------------------------------------------
// Base types for each supported schema.org type
// ---------------------------------------------------------------------------

/** Schema.org Person — author / provider identity. */
interface PersonSchema {
	"@context": "https://schema.org";
	"@type": "Person";
	name: string;
	url: string;
	sameAs: string[];
	jobTitle: string;
	description: string;
	image: string;
}

/** Schema.org WebSite with Sitelinks Searchbox. */
interface WebSiteSchema {
	"@context": "https://schema.org";
	"@type": "WebSite";
	name: string;
	url: string;
	description: string;
	potentialAction: {
		"@type": "SearchAction";
		target: {
			"@type": "EntryPoint";
			urlTemplate: string;
		};
		"query-input": string;
	};
}

/** A single breadcrumb item. */
interface BreadcrumbItem {
	"@type": "ListItem";
	position: number;
	name: string;
	item: string;
}

/** Schema.org BreadcrumbList. */
interface BreadcrumbListSchema {
	"@context": "https://schema.org";
	"@type": "BreadcrumbList";
	itemListElement: BreadcrumbItem[];
}

/** A single feature bullet for a Service. */
interface ServiceFeature {
	"@type": "ServiceFeature";
	name: string;
}

/** Schema.org Service for a service detail page. */
interface ServiceSchema {
	"@context": "https://schema.org";
	"@type": "Service";
	name: string;
	provider: { "@type": "Person"; name: string };
	description: string;
	serviceType: string;
	areaServed: string;
	category: string;
	hasOfferCatalog?: {
		"@type": "OfferCatalog";
		name: string;
		itemListElement: Array<{
			"@type": "ServiceFeature";
			name: string;
		}>;
	};
}

// ---------------------------------------------------------------------------
// Shared constants
// ---------------------------------------------------------------------------

/** Canonical base URL (no www). */
const BASE_URL = "https://daniel-freire.com";

/** Canonical OG image used across the site. */
const PERSON_IMAGE = `${BASE_URL}/metadata/open-graph-initials5.png`;

// ---------------------------------------------------------------------------
// Schema generators
// ---------------------------------------------------------------------------

/**
 * Generates the Person schema for Daniel Freire.
 *
 * Used globally on every page as the author/provider identity signal
 * for search engines.
 */
export function generatePersonSchema(): PersonSchema {
	return {
		"@context": "https://schema.org",
		"@type": "Person",
		name: "Daniel Freire",
		url: BASE_URL,
		sameAs: ["https://github.com/danielfreire-dev/", "https://www.linkedin.com/in/danielfreire-swe/"],
		jobTitle: "Web Developer",
		description:
			"Daniel Freire is a web developer specializing in AI-powered applications, LLM integration, and high-performance web solutions.",
		image: PERSON_IMAGE,
	};
}

/**
 * Generates the WebSite schema with Sitelinks Searchbox.
 *
 * Enables the search box sitelink in Google SERPs.  The `urlTemplate`
 * points at Google's custom search endpoint; replace with your own
 * search route if you implement on-site search.
 */
export function generateWebSiteSchema(): WebSiteSchema {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Daniel Freire",
		url: BASE_URL,
		description:
			"Portfolio of Daniel Freire — web developer building AI-powered applications, custom software, and high-performance websites.",
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `https://www.google.com/search?q=site%3Adaniel-freire.com+{search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	};
}

/**
 * Generates a BreadcrumbList schema from a list of path segments.
 *
 * Each segment is paired with its full URL.  The first item is always
 * the home page; additional items build on that base.
 *
 * @param crumbs - Array of { name, href } pairs in display order.
 * @returns A BreadcrumbList schema or null if crumbs is empty.
 */
export function generateBreadcrumbSchema(crumbs: Array<{ name: string; href: string }>): BreadcrumbListSchema | null {
	if (!crumbs.length) return null;

	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: crumbs.map((crumb, index) => ({
			"@type": "ListItem" as const,
			position: index + 1,
			name: crumb.name,
			item: crumb.href.startsWith("http") ? crumb.href : `${BASE_URL}${crumb.href}`,
		})),
	};
}

/**
 * Generates the Service schema for a service detail page.
 *
 * Includes the provider (Person), description, service type, features,
 * and geographic coverage.
 *
 * @param title       - The localized service title.
 * @param description - A short description of the service.
 * @param features    - The list of feature strings.
 * @param slug        - The canonical English slug for the service.
 * @returns A Service schema.
 */
export function generateServiceSchema(
	title: string,
	description: string,
	features: string[],
	slug: string,
): ServiceSchema {
	return {
		"@context": "https://schema.org",
		"@type": "Service",
		name: title,
		provider: { "@type": "Person", name: "Daniel Freire" },
		description,
		serviceType: title,
		areaServed: "Worldwide",
		category: (SERVICE_SLUGS as readonly string[]).includes(slug) ? slug : "Web Development",
		hasOfferCatalog:
			features.length ?
				{
					"@type": "OfferCatalog",
					name: `${title} Features`,
					itemListElement: features.map((feature) => ({
						"@type": "ServiceFeature" as const,
						name: feature,
					})),
				}
			:	undefined,
	};
}
