import ClientSideAbout from "../../../ui/Components/ClientPage";
import { use } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { Locale } from "next-intl";

/** Props for the About page, receiving locale and search params from Next.js. */
interface Props {
	/** Promise resolving to an object with the locale. */
	params: Promise<{ locale: Locale }>;
}

/**
 * Generates localized metadata for the About page.
 *
 * @param props - Component props containing locale and search params.
 * @param props.params - Promise resolving to an object with the locale.
 * @param props.searchParams - Promise resolving to search parameters (unused but required by Next.js).
 * @returns Metadata object with localized title, description, canonical URL, and Open Graph data.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({
		locale: locale,
		namespace: "metadata",
	});

	return {
		title: t("title.about"),
		description: t("description.about"),
		alternates: {
			canonical: "/about",
			languages: {
				en: "https://daniel-freire.com/en/about",
				pt: "https://daniel-freire.com/pt/sobre",
			},
		},
		openGraph: {
			title: t("opengraphImageAlt"),
			description: t("description.about"),
			url: "https://daniel-freire.com",
			siteName: t("title.about"),
			images: [{ url: `https://daniel-freire.com/metadata/open-graph-initials5.png` }],
			locale: locale,
			type: "website",
		},
	};
}

/**
 * About page server component.
 *
 * Renders the client-side About content wrapped in a server component
 * for metadata generation and SEO purposes. Uses `setRequestLocale` to
 * enable static rendering per locale.
 *
 * @param params - Route params containing the resolved locale.
 * @returns The client-side About component.
 */
export default function About({ params }: Props) {
	const { locale } = use(params);
	setRequestLocale(locale);

	return <ClientSideAbout />;
}
