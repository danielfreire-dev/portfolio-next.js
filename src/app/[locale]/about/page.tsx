import ClientSideAbout from "../../../ui/Components/ClientPage";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { Locale } from "next-intl";

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
		title: t("title.about"),
		description: t("description.about"),
		alternates: {
			canonical: "/about",
			languages: {
				en: "https://daniel-freire.com/en/about",
				pt: "https://daniel-freire.com/pt/sobre",
			},
		},
		openGraph: {
			title: t("opengraphImageAlt"),
			description: t("description.about"),
			url: "https://daniel-freire.com",
			siteName: t("title.about"),
			images: [
				{ url: `https://daniel-freire.com/metadata/open-graph-initials5.png` },
			],
			locale: locale,
			type: "website",
		},
	};
}

const About = async () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ClientSideAbout />
		</Suspense>
	);
};

export default About;
