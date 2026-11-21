import { Locale, useTranslations } from "next-intl";
import { Suspense, use } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";
import TopMainPage from "@/ui/Components/TopMainPage";
import Services from "@/ui/Components/Services";
import SelectedWork from "@/ui/Components/Home/SelectedWork";
import TechMarquee from "@/ui/Components/Home/TechMarquee";
import WhyMe from "@/ui/Components/Home/WhyMe";
import Process from "@/ui/Components/Home/Process";
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
 * Sections, in order: hero (`TopMainPage`, the page's `<h1>`), selected work
 * marquee, tech logo marquee (scrolling the opposite way), services,
 * "why work with me", "how I work". The global CTA follows from the layout.
 * The full tech stack lives on the About page; the marquee here uses image
 * files for logos to keep this page's HTML light.
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
			<SelectedWork />
			<TechMarquee />
			<Suspense>
				<Services />
			</Suspense>
			<WhyMe />
			<Process />
		</>
	);
}
