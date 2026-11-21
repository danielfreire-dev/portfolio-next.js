import { SERVICE_SLUGS } from "@/i18n/serviceSlugs";
import { BASE_URL, getCanonicalUrl } from "@/i18n/alternates";

// ---------------------------------------------------------------------------
// Base types for each supported schema.org type
// ---------------------------------------------------------------------------

/** Schema.org ImageObject — one rendition of an image. */
interface ImageObjectSchema {
	"@type": "ImageObject";
	url: string;
	contentUrl: string;
	width: number;
	height: number;
}

/** Schema.org ContactPoint — how to reach the person (nested in Person). */
interface ContactPointSchema {
	"@type": "ContactPoint";
	contactType: string;
	email: string;
	url: string;
	availableLanguage: string[];
}

/** Schema.org Person — author / provider identity. */
interface PersonSchema {
	"@context": "https://schema.org";
	"@type": "Person";
	"@id": string;
	name: string;
	url: string;
	sameAs: string[];
	jobTitle: string;
	description: string;
	image: ImageObjectSchema[];
	contactPoint: ContactPointSchema;
}

/** Schema.org WebSite. */
interface WebSiteSchema {
	"@context": "https://schema.org";
	"@type": "WebSite";
	"@id": string;
	name: string;
	url: string;
	description: string;
	publisher: { "@id": string };
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

/** Schema.org Service for a service detail page. */
interface ServiceSchema {
	"@context": "https://schema.org";
	"@type": "Service";
	name: string;
	provider: { "@type": "Person"; "@id": string; name: string };
	description: string;
	url: string;
	serviceType: string;
	areaServed: string;
	category: string;
	hasOfferCatalog?: {
		"@type": "OfferCatalog";
		name: string;
		itemListElement: Array<{
			"@type": "Offer";
			itemOffered: {
				"@type": "Service";
				name: string;
			};
		}>;
	};
}

// ---------------------------------------------------------------------------
// Shared constants
// ---------------------------------------------------------------------------

/** Stable identifier of the Person entity, referenced by other schemas. */
const PERSON_ID = `${BASE_URL}/#person`;

/** Public contact address used in structured data. */
const CONTACT_EMAIL = "hello@daniel-freire.com";

/**
 * Renditions of Daniel's portrait (the same image shown on the About page),
 * generated from `/images/Lensa/Lensa2.webp`.  Listed largest first so
 * consumers that pick the first image get the best quality.
 */
const PERSON_IMAGES: ReadonlyArray<{ path: string; size: number }> = [
	{ path: "/images/person/daniel-freire-1024.jpg", size: 1024 },
	{ path: "/images/person/daniel-freire-1024.webp", size: 1024 },
	{ path: "/images/person/daniel-freire-512.webp", size: 512 },
	{ path: "/images/person/daniel-freire-256.webp", size: 256 },
];

// ---------------------------------------------------------------------------
// Schema generators
// ---------------------------------------------------------------------------

/**
 * Generates the Person schema for Daniel Freire.
 *
 * Used globally on every page as the author/provider identity signal
 * for search engines.  The nested ContactPoint links to the contact page
 * of the current locale so the URL never redirects.
 *
 * @param locale - The current page locale (defaults to English).
 */
export function generatePersonSchema(locale = "en"): PersonSchema {
	return {
		"@context": "https://schema.org",
		"@type": "Person",
		"@id": PERSON_ID,
		name: "Daniel Freire",
		url: BASE_URL,
		sameAs: ["https://github.com/danielfreire-dev/", "https://www.linkedin.com/in/danielfreire-swe/"],
		jobTitle: "Web Developer",
		description:
			"Daniel Freire is a web developer specializing in AI-powered applications, LLM integration, and high-performance web solutions.",
		image: PERSON_IMAGES.map(({ path, size }) => ({
			"@type": "ImageObject" as const,
			url: `${BASE_URL}${path}`,
			contentUrl: `${BASE_URL}${path}`,
			width: size,
			height: size,
		})),
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "customer service",
			email: CONTACT_EMAIL,
			url: getCanonicalUrl("/contact", locale),
			availableLanguage: ["English", "Portuguese", "Danish", "Polish", "German", "Czech"],
		},
	};
}

/**
 * Generates the WebSite schema, published by the Person entity.
 */
export function generateWebSiteSchema(): WebSiteSchema {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": `${BASE_URL}/#website`,
		name: "Daniel Freire",
		url: BASE_URL,
		description:
			"Portfolio of Daniel Freire — web developer building AI-powered applications, custom software, and high-performance websites.",
		publisher: { "@id": PERSON_ID },
	};
}

/**
 * Generates a BreadcrumbList schema from a list of path segments.
 *
 * Each segment is paired with its full URL.  The first item is always
 * the home page; additional items build on that base.  Pass absolute,
 * localized URLs (see `getCanonicalUrl`) so breadcrumbs never point at
 * redirecting addresses.
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
 * @param url         - The absolute canonical URL of the service page.
 * @returns A Service schema.
 */
export function generateServiceSchema(
	title: string,
	description: string,
	features: string[],
	slug: string,
	url: string,
): ServiceSchema {
	return {
		"@context": "https://schema.org",
		"@type": "Service",
		name: title,
		provider: { "@type": "Person", "@id": PERSON_ID, name: "Daniel Freire" },
		description,
		url,
		serviceType: title,
		areaServed: "Worldwide",
		category: (SERVICE_SLUGS as readonly string[]).includes(slug) ? title : "Web Development",
		hasOfferCatalog:
			features.length ?
				{
					"@type": "OfferCatalog",
					name: `${title} Features`,
					itemListElement: features.map((feature) => ({
						"@type": "Offer" as const,
						itemOffered: {
							"@type": "Service" as const,
							name: feature,
						},
					})),
				}
			:	undefined,
	};
}
