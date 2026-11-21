import { Locale, useTranslations } from "next-intl";
import WebsiteCards from "../../../ui/Components/WebsiteCards";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { use } from "react";
import { generateBreadcrumbSchema } from "@/ui/Components/StructuredData";
import { getCanonicalUrl } from "@/i18n/alternates";
import { buildPageMetadata } from "@/i18n/pageMetadata";

interface Props {
	params: Promise<{ locale: Locale }>;
}

/**
 * Generates localized metadata for the portfolio page.
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
		href: "/portfolio",
		locale,
		title: t("seoTitle.portfolio"),
		description: t("description.portfolio"),
		keywords: [
			"web development portfolio",
			"React projects",
			"AI tools",
			"business software",
			"Next.js projects",
			"full-stack portfolio",
		],
	});
}

/**
 * Portfolio page — displays project and website cards with a CTA.
 *
 * Route: /[locale]/portfolio
 */
const Portfolio = ({ params }: Props) => {
	const { locale } = use(params);
	setRequestLocale(locale);

	const t = useTranslations("portfolio");
	const m = useTranslations("metadata.title");
	const b = useTranslations("breadcrumbs");

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbSchema([
							{ name: b("home"), href: getCanonicalUrl("/", locale) },
							{ name: m("portfolio"), href: getCanonicalUrl("/portfolio", locale) },
						]),
					),
				}}
			/>
			<h1 className="text-2xl font-bold mx-auto text-center capitalize mb-4">{t("pageTitle")}!</h1>

			<WebsiteCards />
		</>
	);
};

export default Portfolio;
