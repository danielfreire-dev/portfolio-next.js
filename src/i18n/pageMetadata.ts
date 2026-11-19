import type { Metadata } from "next";
import { BASE_URL, getAlternates, type GetAlternatesOptions } from "@/i18n/alternates";

/** Shared Open Graph image used by every page. */
export const OG_IMAGE = {
	url: `${BASE_URL}/metadata/open-graph-initials5.png`,
	width: 1200,
	height: 630,
} as const;

/**
 * Maps each app locale to the `language_TERRITORY` format required by the
 * Open Graph protocol (`og:locale` / `og:locale:alternate`).
 */
export const OG_LOCALES: Record<string, string> = {
	en: "en_US",
	pt: "pt_PT",
	da: "da_DK",
	pl: "pl_PL",
	de: "de_DE",
	cs: "cs_CZ",
};

/** Site name, appended to page titles by the layout's title template. */
export const SITE_NAME = "Daniel Freire";

/** Options for {@link buildPageMetadata}. */
interface BuildPageMetadataOptions extends GetAlternatesOptions {
	/** Page `<title>`; the layout's template appends ` | Daniel Freire`. */
	title: string;
	/**
	 * Use `title` verbatim, without the ` | Daniel Freire` suffix.  For titles
	 * that already contain the name (the home page).
	 */
	absoluteTitle?: boolean;
	/** Meta description, also reused for Open Graph. */
	description: string;
	/** Optional Open Graph title; defaults to the full document title. */
	ogTitle?: string;
	/** Optional meta keywords. */
	keywords?: string[];
	/** Whether the page may be indexed (defaults to `true`). */
	index?: boolean;
}

/**
 * Builds the complete `Metadata` object for a localized page.
 *
 * Centralises canonical, hreflang and Open Graph generation so that every
 * page emits the same, non-redirecting localized URL in `<link rel=canonical>`,
 * `hreflang` alternates and `og:url`.
 */
export function buildPageMetadata({
	href,
	locale,
	hrefForLocale,
	title,
	absoluteTitle = false,
	description,
	ogTitle,
	keywords,
	index = true,
}: BuildPageMetadataOptions): Metadata {
	const alternates = getAlternates({ href, locale, hrefForLocale });
	const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

	return {
		title: absoluteTitle ? { absolute: title } : title,
		description,
		keywords,
		robots: { index, follow: true },
		alternates,
		openGraph: {
			type: "website",
			siteName: SITE_NAME,
			title: ogTitle ?? fullTitle,
			description,
			url: String(alternates.canonical),
			locale: OG_LOCALES[locale] ?? locale,
			alternateLocale: Object.entries(OG_LOCALES)
				.filter(([code]) => code !== locale)
				.map(([, ogLocale]) => ogLocale),
			images: [OG_IMAGE],
		},
	};
}
