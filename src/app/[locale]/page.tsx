import { Locale, useTranslations } from "next-intl";
import { Suspense, use } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";
import TopMainPage from "@/ui/Components/TopMainPage";
import Services from "@/ui/Components/Services";
import { generateBreadcrumbSchema } from "@/ui/Components/StructuredData";
import { getCanonicalUrl } from "@/i18n/alternates";
import { buildPageMetadata } from "@/i18n/pageMetadata";

interface Props {
	params: Promise<{ locale: Locale }>;
}

/**
 * Generates localized metadata for the home page.
 *
 * Fetches translated title, description, and Open Graph data based on the
 * resolved locale from the route params.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({
		locale: locale,
		namespace: "metadata",
	});

	return buildPageMetadata({
		href: "/",
		locale,
		title: t("seoTitle.home"),
		absoluteTitle: true,
		description: t("description.home"),
		keywords: [
			"web developer",
			"AI applications",
			"custom software",
			"high-performance websites",
			"Daniel Freire",
			"full-stack developer",
		],
	});
}

/**
 * Home page — the main landing route for the application.
 *
 * Renders the hero section (`TopMainPage`) and the services overview. The
 * tech stack lives on the About page to keep this page's HTML light.
 * Uses `setRequestLocale` to enable static rendering per locale.
 *
 * @param params - Route params containing the resolved locale.
 */
export default function HomePage({ params }: Props) {
	const { locale } = use(params);

	setRequestLocale(locale);
	const b = useTranslations("breadcrumbs");

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(generateBreadcrumbSchema([{ name: b("home"), href: getCanonicalUrl("/", locale) }])),
				}}
			/>
			<TopMainPage />
			<Suspense>
				<Services />
			</Suspense>
		</>
	);
}
