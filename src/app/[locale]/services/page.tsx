import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { use } from "react";
import { Locale } from "next-intl";
import Services from "@/ui/Components/Services";
import { generateBreadcrumbSchema } from "@/ui/Components/StructuredData";
import { getAlternates } from "@/i18n/alternates";

interface Props {
	params: Promise<{ locale: Locale }>;
}

/**
 * Generates localized metadata for the services listing page.
 *
 * Fetches translated title and description based on the resolved locale
 * from the route params, and sets canonical and Open Graph data.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({
		locale: locale,
		namespace: "metadata",
	});

	return {
		title: t("title.services"),
		description: t("description.services"),
		keywords: [
			"web development services",
			"AI solutions",
			"custom software",
			"LLM integration",
			"technical consulting",
			"custom CRM",
			"AI agents",
		],
		robots: { index: true, follow: true },
		alternates: getAlternates({ href: "/services", locale }),
		openGraph: {
			type: "website",
			title: t("title.services"),
			description: t("description.services"),
			url: "https://daniel-freire.com/services",
			siteName: `${t("title.services")} | Daniel Freire`,
			images: [{ url: "https://daniel-freire.com/metadata/open-graph-initials5.png", width: 1200, height: 630 }],
			locale: locale,
		},
		twitter: {
			card: "summary_large_image",
			title: t("title.services"),
			description: t("description.services"),
			images: ["https://daniel-freire.com/metadata/open-graph-initials5.png"],
		},
	};
}

/**
 * Services listing page — delegates rendering to the shared
 * {@link Services} component.
 *
 * Route: /[locale]/services
 */
const ServicesPage = ({ params }: Props) => {
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
							{ name: "Services", href: `/${locale}/services` },
						]),
					),
				}}
			/>
			<Services />
		</>
	);
};

export default ServicesPage;
