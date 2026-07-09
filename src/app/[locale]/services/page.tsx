import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { use } from "react";
import { Locale } from "next-intl";
import Services from "@/ui/Components/Services";

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
		alternates: {
			canonical: "/services",
			languages: {
				en: "https://daniel-freire.com/en/services",
				pt: "https://daniel-freire.com/pt/servicos",
			},
		},
		openGraph: {
			title: t("opengraphImageAlt"),
			description: t("description.services"),
			url: "https://daniel-freire.com",
			siteName: `${t("title.services")} | Daniel Freire`,
			images: [{ url: "https://daniel-freire.com/metadata/open-graph-initials5.png" }],
			locale: locale,
			type: "website",
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

	return <Services />;
};

export default ServicesPage;
