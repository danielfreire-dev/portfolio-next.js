import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidenav from "@/ui/Components/Sidenav/Sidenav";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@/providers/CookieBanner";
import GoogleAnalytics from "@/providers/GoogleAnalytics";
import { Suspense } from "react";

/* Metadata */
export const metadata: Metadata = {
	title: {
		template: "%s | Daniel Freire",
		default: "Daniel Freire",
	},
	authors: { name: "Daniel Freire", url: "https://daniel-freire.com/" },
	creator: "Daniel Freire",
	keywords: [
		"Daniel Freire",
		"Portfolio",
		"Next.js",
		"React",
		"TypeScript",
		"JavaScript",
		"Digital Marketing",
	],
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://www.daniel-freire.com/"),

	openGraph: {
		type: "website",

		images: [
			{ url: `https://daniel-freire.com/metadata/open-graph-initials5.png` },
		],
	},
};

/* export async function generateMetadata({
	params,
	searchParams,
}: Props): Promise<Metadata> {

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
			siteName: t("title.home"),
			images: [
				{ url: `https://daniel-freire.com/metadata/open-graph-initials5.png` },
			],
			locale: locale,
		},
	};
} */

/* Fonts */
const Logo = localFont({
	src: "../../ui/fonts/Mozilla_Headline/MozillaHeadline-VariableFont_wdth,wght.ttf",
	display: "swap",
	variable: "--font-logo",
	weight: "500",
});

const Heading = localFont({
	src: "../../ui/fonts/IBM_Plex/IBM_Plex_Serif/IBMPlexSerif-Regular.ttf",
	display: "swap",
	variable: "--font-heading",
});

const Text = localFont({
	src: "../../ui/fonts/IBM_Plex/Sans_Variable/IBM Plex Sans Var-Roman.woff2",

	display: "swap",
	variable: "--font-text",
	weight: "400",
});

const Small = localFont({
	src: "../../ui/fonts/IBM_Plex/Sans_Variable/IBM Plex Sans Var-Roman.woff2",
	display: "swap",
	variable: "--font-small",
	weight: "300",
});

const SmallItalic = localFont({
	src: "../../ui/fonts/IBM_Plex/Sans_Variable/IBM Plex Sans Var-Italic.woff2",
	display: "swap",
	variable: "--font-small-itallic",
	style: "italic",
});

/* Create i18n routes */
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

const googleAnalytics = process.env.NEXT_PUBLIC_GA4;

export default async function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	// Ensure that the incoming `locale` is valid
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	// Get messages for the locale
	const messages = await getMessages();

	return (
		<html lang={locale}>
			<SpeedInsights />
			<Suspense fallback={null}>
				<GoogleAnalytics GA_MEASUREMENT_ID={googleAnalytics!} />
			</Suspense>
			<body
				className={`${Logo.variable} ${Heading.variable} ${Text.variable} ${Small.variable} ${SmallItalic.variable}  antialiased flex min-h-screen selection:bg-(--primary) selection:text-(--hover-text) stars`}
			>
				<NextIntlClientProvider messages={messages}>
					<Providers>
						<header className="flex flex-row">
							<Sidenav />
						</header>
						<main className="flex flex-1 justify-center flex-col overflow-hidden pb-5 mt-9">
							<div id="main">{children}</div>
						</main>
					</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
