import { MetadataRoute } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

/**
 * Generates the Web App Manifest for Progressive Web App (PWA) support.
 *
 * Uses the current locale for the app name and configures the display mode,
 * theme color, icons, and locale-scoped start URL for the installed app.
 */
export default async function manifest({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<MetadataRoute.Manifest> {
	const { locale } = await params;

	// Enable static rendering for this locale
	setRequestLocale(locale);

	const t = await getTranslations({ namespace: "metadata", locale });

	return {
		name: t("name"),
		short_name: t("name"),
		description: t("description.home"),
		start_url: `/${locale}`,
		theme_color: "#ff7f00",
		background_color: "#ffffff",
		display: "standalone",
		icons: [
			{
				src: "/favicon.ico",
				sizes: "any",
				type: "image/x-icon",
			},
			{
				src: "/metadata/apple-icon.png",
				sizes: "180x180",
				type: "image/png",
			},
		],
	};
}
