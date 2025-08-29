import Techstack from "@/ui/Components/Techstack/Techstack";
import Cta from "@/ui/Components/CtA/Cta";
import Slider from "@/ui/Components/Carousel";

import { Locale, useTranslations } from "next-intl";
import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";
import { alt } from "./opengraph-image";
import TopMainPage from "@/ui/Components/TopMainPage";

interface Props {
	params: Promise<{ locale: Locale }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
	params,
	searchParams,
}: Props): Promise<Metadata> {
	// Await the params Promise to get the actual locale value
	const { locale } = await params;
	const t = await getTranslations({
		locale: locale,
		namespace: "metadata",
	});

	return {
		title: t("title.home"),
		description: t("description.home"),
		alternates: {
			canonical: "https://daniel-freire.com",
			languages: {
				en: "https://daniel-freire.com/en",
				pt: "https://daniel-freire.com/pt",
			},
		},
		openGraph: {
			type: "website",
			title: t("opengraphImageAlt"),
			description: t("description.home"),
			url: "https://daniel-freire.com",
			siteName: t("title.about"),
			images: [
				{ url: `https://daniel-freire.com/metadata/open-graph-initials5.png` },
			],
			locale: locale,
		},
	};
}

/* interface Props {
	params: Promise<{ locale: Locale }>;
} */

export default function HomePage({ params }: Props) {
	const { locale } = use(params);

	// Enable static rendering
	setRequestLocale(locale);

	const t = useTranslations();

	return (
		<>
			{/* <Slider items={t.raw("carousel")} /> */}
			<TopMainPage />
			<Techstack />
			<Cta />
		</>
	);
}
