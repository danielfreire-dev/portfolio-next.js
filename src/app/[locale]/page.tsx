import Techstack from "@/ui/Components/Techstack/Techstack";

import { Locale } from "next-intl";
import { Suspense, use } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";
import TopMainPage from "@/ui/Components/TopMainPage";
import Services from "@/ui/Components/Services";
import { generateBreadcrumbSchema } from "@/ui/Components/StructuredData";
import { getAlternates } from "@/i18n/alternates";

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
		keywords: [
			"web developer",
			"AI applications",
			"custom software",
			"high-performance websites",
			"Daniel Freire",
			"full-stack developer",
			"Portugal",
		],
		robots: { index: true, follow: true },
		alternates: getAlternates({ href: "/", locale }),
		openGraph: {
			type: "website",
			title: t("title.home"),
			description: t("description.home"),
			url: "https://daniel-freire.com",
			locale: locale,
			images: [{ url: "https://daniel-freire.com/metadata/open-graph-initials5.png", width: 1200, height: 630 }],
		},
		twitter: {
			card: "summary_large_image",
			site: "@daniel_freire",
			creator: "@daniel_freire",
			title: t("title.home"),
			description: t("description.home"),
			images: ["https://daniel-freire.com/metadata/open-graph-initials5.png"],
		},
	};
}

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
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(generateBreadcrumbSchema([{ name: "Home", href: `/${locale}` }])),
				}}
			/>
			<TopMainPage />
			<Suspense>
				<Services />
			</Suspense>
			<Suspense>
				<Techstack />
			</Suspense>
		</>
	);
}
