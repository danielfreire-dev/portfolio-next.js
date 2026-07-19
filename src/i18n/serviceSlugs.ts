/**
 * Canonical English slugs for every service offered.
 *
 * The authoritative list shared across the sitemap, the dynamic service-detail
 * route, and structured-data generators.  The ordering is significant: every
 * locale-specific list in `SERVICE_SLUGS_BY_LOCALE` must match this order so
 * index-based cross-locale lookups work correctly.
 */
export const SERVICE_SLUGS = [
	"business-custom-software",
	"ai-solution-implementation",
	"web-development",
	"seo-technical-consulting",
] as const;

/** Union type derived from the canonical slug list. */
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

/**
 * Localized slugs for every supported locale, index-aligned with
 * {@link SERVICE_SLUGS} so that lookups by canonical English slug
 * (via `indexOf`) always resolve to the correct translation.
 */
export const SERVICE_SLUGS_BY_LOCALE: Record<string, readonly string[]> = {
	en: ["business-custom-software", "ai-solution-implementation", "web-development", "seo-technical-consulting"],
	pt: [
		"software-personalizado-empresarial",
		"implementacao-solucoes-ia",
		"desenvolvimento-web",
		"seo-consultoria-tecnica",
	],
	da: ["skraeddersyet-forretningssoftware", "implementering-af-ai-losninger", "webudvikling", "seo-teknisk-radgivning"],
	pl: [
		"dedykowane-oprogramowanie-biznesowe",
		"wdrazanie-rozwiazan-ai",
		"tworzenie-stron-internetowych",
		"seo-doradztwo-techniczne",
	],
	de: [
		"massgeschneiderte-unternehmenssoftware",
		"implementierung-von-ki-losungen",
		"webentwicklung",
		"seo-technische-beratung",
	],
	cs: ["zakazkovy-firemni-software", "implementace-ai-reseni", "vyvoj-webovych-stranek", "seo-technicke-poradenstvi"],
};

/**
 * Returns every localized slug from all supported locales as a flat array.
 *
 * Useful for `generateStaticParams` — pre-renders every service-detail page
 * regardless of locale.
 */
export function getAllLocalizedSlugs(): string[] {
	return Object.values(SERVICE_SLUGS_BY_LOCALE).flat();
}

/**
 * Given a canonical English slug, returns the localized slug for the
 * requested locale.
 *
 * Falls back to the English slug itself when the locale is unknown or
 * the English slug isn't found in the canonical list.
 *
 * @param englishSlug - The canonical English slug (e.g. "business-custom-software").
 * @param locale       - The target locale (e.g. "cs").
 * @returns The localized slug (e.g. "zakazkovy-firemni-software").
 */
export function getLocalizedSlug(englishSlug: string, locale: string): string {
	const index = (SERVICE_SLUGS as readonly string[]).indexOf(englishSlug);
	if (index === -1) return englishSlug;

	const localeSlugs = SERVICE_SLUGS_BY_LOCALE[locale];
	if (!localeSlugs || index >= localeSlugs.length) return englishSlug;

	return localeSlugs[index];
}

/**
 * Given a localized slug (in any locale), returns the corresponding
 * canonical English slug by searching across all locale arrays.
 *
 * Falls back to the input slug when no match is found.
 *
 * @param localizedSlug - A slug in any locale (e.g. "zakazkovy-firemni-software").
 * @returns The canonical English slug (e.g. "business-custom-software").
 */
export function toEnglishSlug(localizedSlug: string): string {
	for (const [locale, slugs] of Object.entries(SERVICE_SLUGS_BY_LOCALE)) {
		const index = (slugs as readonly string[]).indexOf(localizedSlug);
		if (index !== -1) {
			return (SERVICE_SLUGS as readonly string[])[index];
		}
	}
	console.warn(`[toEnglishSlug] Could not resolve English slug for "${localizedSlug}" — returning as-is.`);
	return localizedSlug;
}
