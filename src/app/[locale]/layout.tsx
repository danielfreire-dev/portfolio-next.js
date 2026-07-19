import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidenav from "@/ui/Components/Sidenav/Sidenav";
import Cta from "@/ui/Components/CtA/Cta";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages, setRequestLocale } from "next-intl/server";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@/providers/CookieBanner";
import GoogleAnalytics from "@/providers/GoogleAnalytics";
import { Suspense } from "react";
import { generatePersonSchema, generateWebSiteSchema } from "@/ui/Components/StructuredData";

/**
 * Static metadata for the root layout.
 *
 * Defines the default title template, author info, SEO keywords, and
 * Open Graph image used across all pages unless overridden by page-level
 * `generateMetadata`.
 */
export const metadata: Metadata = {
	title: {
		template: "%s | Daniel Freire",
		default: "Daniel Freire",
	},
	authors: { name: "Daniel Freire", url: "https://daniel-freire.com/" },
	creator: "Daniel Freire",
	keywords: [
		"Daniel Freire",
		"web developer",
		"AI applications",
		"LLM integration",
		"custom software",
		"high-performance websites",
		"Next.js",
		"React",
		"TypeScript",
		"frontend developer",
		"full-stack developer",
		"Portugal",
	],
	verification: {
		google: process.env.GOOGLE_SITE_VERIFICATION,
		other: {
			"msvalidate.01": process.env.BING_SITE_VERIFICATION as string,
		},
	},
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://daniel-freire.com/"),

	openGraph: {
		type: "website",
		siteName: "Daniel Freire",
		locale: "en_US",
		images: [{ url: `https://daniel-freire.com/metadata/open-graph-initials5.png`, width: 1200, height: 630 }],
	},
};

/**
 * Custom local font definitions.
 *
 * Each font is loaded via `next/font/local` and assigned a CSS custom property
 * so it can be referenced throughout the application's styles.
 */

/** Logo / display font — Mozilla Headline variable weight. */
const Logo = localFont({
	src: "../../ui/fonts/Mozilla_Headline/MozillaHeadline-VariableFont_wdth,wght.ttf",
	display: "swap",
	variable: "--font-logo",
	weight: "500",
});

/** Heading font — IBM Plex Serif regular weight. */
const Heading = localFont({
	src: "../../ui/fonts/IBM_Plex/IBM_Plex_Serif/IBMPlexSerif-Regular.ttf",
	display: "swap",
	variable: "--font-heading",
});

/** Body text font — IBM Plex Sans variable weight (Roman). */
const Text = localFont({
	src: "../../ui/fonts/IBM_Plex/Sans_Variable/IBM Plex Sans Var-Roman.woff2",
	display: "swap",
	variable: "--font-text",
	weight: "400",
});

/** Small / secondary text font — IBM Plex Sans variable weight (light). */
const Small = localFont({
	src: "../../ui/fonts/IBM_Plex/Sans_Variable/IBM Plex Sans Var-Roman.woff2",
	display: "swap",
	variable: "--font-small",
	weight: "300",
});

/** Small italic text font — IBM Plex Sans variable weight (italic). */
const SmallItalic = localFont({
	src: "../../ui/fonts/IBM_Plex/Sans_Variable/IBM Plex Sans Var-Italic.woff2",
	display: "swap",
	variable: "--font-small-itallic",
	style: "italic",
});

/**
 * Generates static route params for each supported locale.
 *
 * Required for static site generation (SSG) with `next-intl` so that
 * Next.js pre-renders a page for every locale at build time.
 */
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

const googleAnalytics = process.env.NEXT_PUBLIC_GA4;

/**
 * Root layout component for the application.
 *
 * Validates the incoming locale against the supported list (triggers 404 if
 * invalid), loads the corresponding i18n messages, and renders the full HTML
 * shell with font variables, analytics, cookie consent provider, and the
 * persistent sidenav navigation.
 *
 * @param children - Page content rendered inside the main content area.
 * @param params  - A promise resolving to an object containing the `locale` segment.
 */
export default async function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	setRequestLocale(locale);

	const messages = await getMessages();

	const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");document.documentElement.classList.add("theme-ready")}catch(e){}})();`;

	return (
		<html
			lang={locale}
			suppressHydrationWarning>
			<head>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify([generatePersonSchema(), generateWebSiteSchema()]),
					}}
				/>
			</head>
			<SpeedInsights />
			<Suspense fallback={null}>
				<GoogleAnalytics GA_MEASUREMENT_ID={googleAnalytics!} />
			</Suspense>
			<body
				className={`${Logo.variable} ${Heading.variable} ${Text.variable} ${Small.variable} ${SmallItalic.variable} antialiased flex min-h-screen selection:bg-(--primary) selection:text-(--selector-txt) `}>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
				<NextIntlClientProvider messages={messages}>
					<Providers>
						<header className="flex flex-row w-dvw">
							<Sidenav />
						</header>
						<main className="flex flex-1 justify-center flex-col  overflow-hidden pb-5 mt-9">
							<div
								id="main "
								className="flex flex-col gap-4">
								{children}
								<Cta />
							</div>
						</main>
					</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
