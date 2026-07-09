import Techstack from "@/ui/Components/Techstack/Techstack";
import Cta from "@/ui/Components/CtA/Cta";

import { Locale } from "next-intl";
import { Suspense, use } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";
import TopMainPage from "@/ui/Components/TopMainPage";
import Services from "@/ui/Components/Services";

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

	return {
		title: t("title.home"),
		description: t("description.home"),
		alternates: {
			canonical: "/",
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
			siteName: t("title.home"),
			locale: locale,
		},
	};
}

/* interface Props {
	params: Promise<{ locale: Locale }>;
} */

/**
 * Home page — the main landing route for the application.
 *
 * Renders the hero section (`TopMainPage`), the tech stack showcase, and a
 * call-to-action button. The tech stack is wrapped in `Suspense` for lazy
 * loading. Uses `setRequestLocale` to enable static rendering per locale.
 *
 * @param params - Route params containing the resolved locale.
 */
export default function HomePage({ params }: Props) {
	const { locale } = use(params);

	setRequestLocale(locale);

	return (
		<>
			<TopMainPage />
			<Services />
			<Suspense>
				<Techstack />
			</Suspense>

			<Cta />
		</>
	);
}
