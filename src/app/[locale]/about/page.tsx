import ClientSideAbout from "../../../ui/Components/ClientPage";
import { use } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { Locale } from "next-intl";
import { generateBreadcrumbSchema } from "@/ui/Components/StructuredData";
import { getAlternates } from "@/i18n/alternates";

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
		keywords: [
			"about Daniel Freire",
			"web developer background",
			"marketing to development",
			"SEO expert developer",
			"AI developer Portugal",
		],
		robots: { index: true, follow: true },
		alternates: getAlternates({ href: "/about", locale }),
		openGraph: {
			type: "website",
			title: t("title.about"),
			description: t("description.about"),
			url: "https://daniel-freire.com/about",
			images: [{ url: "https://daniel-freire.com/metadata/open-graph-initials5.png", width: 1200, height: 630 }],
			locale: locale,
		},
		twitter: {
			card: "summary_large_image",
			site: "@daniel_freire",
			creator: "@daniel_freire",
			title: t("title.about"),
			description: t("description.about"),
			images: ["https://daniel-freire.com/metadata/open-graph-initials5.png"],
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

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbSchema([
							{ name: "Home", href: `/${locale}` },
							{ name: "About", href: `/${locale}/about` },
						]),
					),
				}}
			/>
			<ClientSideAbout />
		</>
	);
}
