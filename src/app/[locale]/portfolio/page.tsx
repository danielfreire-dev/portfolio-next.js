import { Locale, useTranslations } from "next-intl";
import WebsiteCards from "../../../ui/Components/WebsiteCards";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { use } from "react";
import { generateBreadcrumbSchema } from "@/ui/Components/StructuredData";
import { getAlternates } from "@/i18n/alternates";

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

	return {
		title: t("title.portfolio"),
		description: t("description.portfolio"),
		keywords: [
			"web development portfolio",
			"React projects",
			"AI tools",
			"business software",
			"Next.js projects",
			"full-stack portfolio",
		],
		robots: { index: true, follow: true },
		alternates: getAlternates({ href: "/portfolio", locale }),
		openGraph: {
			type: "website",
			title: t("title.portfolio"),
			description: t("description.portfolio"),
			url: "https://daniel-freire.com/portfolio",
			siteName: `${t("title.portfolio")} | Daniel Freire`,
			images: [{ url: "https://daniel-freire.com/metadata/open-graph-initials5.png", width: 1200, height: 630 }],
			locale: locale,
		},
		twitter: {
			card: "summary_large_image",
			title: t("title.portfolio"),
			description: t("description.portfolio"),
			images: ["https://daniel-freire.com/metadata/open-graph-initials5.png"],
		},
	};
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

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbSchema([
							{ name: "Home", href: `/${locale}` },
							{ name: "Portfolio", href: `/${locale}/portfolio` },
						]),
					),
				}}
			/>
			<h2 className="text-2xl font-bold mx-auto text-center capitalize mb-4">{t("pageTitle")}!</h2>

			<WebsiteCards />
		</>
	);
};

export default Portfolio;
