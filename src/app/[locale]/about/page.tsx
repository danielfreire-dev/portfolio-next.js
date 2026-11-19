import ClientSideAbout from "../../../ui/Components/ClientPage";
import Techstack from "@/ui/Components/Techstack/Techstack";
import { Suspense, use } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { Locale, useTranslations } from "next-intl";
import { generateBreadcrumbSchema } from "@/ui/Components/StructuredData";
import { getCanonicalUrl } from "@/i18n/alternates";
import { buildPageMetadata } from "@/i18n/pageMetadata";

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
 * @returns Metadata object with localized title, description, canonical URL, and Open Graph data.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({
		locale: locale,
		namespace: "metadata",
	});

	return buildPageMetadata({
		href: "/about",
		locale,
		title: t("seoTitle.about"),
		description: t("description.about"),
		keywords: [
			"about Daniel Freire",
			"web developer background",
			"marketing to development",
			"SEO expert developer",
			"AI developer",
		],
	});
}

/**
 * About page server component.
 *
 * Renders the biography followed by the tech stack showcase.  The tech
 * stack was moved here from the home page so the landing page stays light.
 * Uses `setRequestLocale` to enable static rendering per locale.
 *
 * @param params - Route params containing the resolved locale.
 * @returns The About page content.
 */
export default function About({ params }: Props) {
	const { locale } = use(params);
	setRequestLocale(locale);
	const t = useTranslations("metadata.title");
	const b = useTranslations("breadcrumbs");

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbSchema([
							{ name: b("home"), href: getCanonicalUrl("/", locale) },
							{ name: t("about"), href: getCanonicalUrl("/about", locale) },
						]),
					),
				}}
			/>
			<ClientSideAbout />
			<Suspense>
				<Techstack />
			</Suspense>
		</>
	);
}
