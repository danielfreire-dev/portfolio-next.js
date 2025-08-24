import { Locale, useTranslations } from "next-intl";
import Cta from "../../../ui/Components/CtA/Cta";
import WebsiteCards from "../../../ui/Components/WebsiteCards";
import { getTranslations } from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";

interface Props {
	params: Promise<{ locale: Locale }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	// Await the params Promise to get the actual locale value
	const { locale } = await params;
	const t = await getTranslations({
		locale: locale,
		namespace: "metadata",
	});
	// optionally access and extend (rather than replace) parent metadata
	const previousImages = (await parent).openGraph?.images || [];

	return {
		title: t("title.portfolio"),
		description: t("description.portfolio"),
		alternates: {
			canonical: "https://daniel-freire.com",
			languages: {
				en: "https://daniel-freire.com/en",
				pt: "https://daniel-freire.com/pt",
			},
		},
		openGraph: {
			title: t("opengraphImageAlt"),
			description: t("description.portfolio"),
			url: "https://daniel-freire.com",
			siteName: `${t("title.portfolio")} | Daniel Freire`,
			images: [
				{ url: "https://daniel-freire.com/metadata/open-graph.png" },
				...previousImages,
			],
		},
	};
}

const Portfolio = () => {
	const t = useTranslations("portfolio");

	return (
		<>
			<h2 className="capitalize mx-15 my-5">{t("pageTitle")}!</h2>

			<WebsiteCards />

			<Cta />
		</>
	);
};

export default Portfolio;
