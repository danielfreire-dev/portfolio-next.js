import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidenav from "@/ui/Components/Sidenav/Sidenav";
import Cta from "@/ui/Components/CtA/Cta";
import { TransitionOverlay } from "@/ui/Components/TransitionOverlay";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages, setRequestLocale } from "next-intl/server";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@/providers/CookieBanner";
import GoogleAnalytics from "@/providers/GoogleAnalytics";
import { Suspense } from "react";
import { generatePersonSchema, generateWebSiteSchema } from "@/ui/Components/StructuredData";
import { themeScript } from "@/lib/themeScript";
import { OG_IMAGE } from "@/i18n/pageMetadata";
import { GLOBAL_CLIENT_MESSAGES, pickMessages } from "@/i18n/clientMessages";

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
	description:
		"Daniel Freire, web developer building custom software, AI-powered applications, and high-performance websites for clients worldwide.",
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
	metadataBase: new URL("https://daniel-freire.com"),

	openGraph: {
		type: "website",
		siteName: "Daniel Freire",
		locale: "en_US",
		images: [OG_IMAGE],
	},

	/** Large preview card when links are shared; title/description/image fall back to Open Graph. */
	twitter: {
		card: "summary_large_image",
	},
};

/**
 * Custom local font definitions.
 *
 * Each font is loaded via `next/font/local` and assigned a CSS custom property
 * so it can be referenced throughout the application's styles.
 *
 * The files in `ui/fonts/subset/` are WOFF2 subsets of the originals covering
 * Latin + Latin Extended-A (all six site languages) and common punctuation.
 * Unused variation axes were pinned (width everywhere; weight 500 for the
 * logo font), which cuts total font weight from ~810 KB to ~165 KB.
 * Sources and regeneration steps: `ui/fonts/sources/README.md`.
 */

/** Logo / display font — Mozilla Headline variable weight. */
const Logo = localFont({
	src: "../../ui/fonts/subset/MozillaHeadline-500-latin.woff2",
	display: "swap",
	variable: "--font-logo",
	weight: "500",
});

/** Heading font — IBM Plex Serif regular weight. */
const Heading = localFont({
	src: "../../ui/fonts/subset/IBMPlexSerif-Regular-latin.woff2",
	display: "swap",
	variable: "--font-heading",
});

/** Body text font — IBM Plex Sans variable weight (Roman). */
const Text = localFont({
	src: "../../ui/fonts/subset/IBMPlexSansVar-Roman-latin.woff2",
	// "optional": never swap after first paint. A swap re-flows body text
	// (≈13% larger), which Chrome records as a late LCP. First visits on slow
	// connections may show the fallback; later page views use the cached font.
	display: "optional",
	variable: "--font-text",
	// Full range of the variable font, so semibold/bold text uses real glyphs
	// instead of browser-synthesized ("fake") bold.
	weight: "100 700",
});

/** Small / secondary text font — IBM Plex Sans variable weight (light). */
const Small = localFont({
	src: "../../ui/fonts/subset/IBMPlexSansVar-Roman-latin.woff2",
	// "optional": never swap after first paint. A swap re-flows body text
	// (≈13% larger), which Chrome records as a late LCP. First visits on slow
	// connections may show the fallback; later page views use the cached font.
	display: "optional",
	variable: "--font-small",
	weight: "300",
});

/** Small italic text font — IBM Plex Sans variable weight (italic). */
const SmallItalic = localFont({
	src: "../../ui/fonts/subset/IBMPlexSansVar-Italic-latin.woff2",
	display: "swap",
	variable: "--font-small-itallic",
	style: "italic",
	// Only used for footer links — not worth competing with critical fonts.
	preload: false,
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

	// Only the messages that global Client Components need are serialised
	// into the page; Server Components read the full set on the server.
	const messages = pickMessages(await getMessages(), GLOBAL_CLIENT_MESSAGES);

	return (
		<html
			lang={locale}
			suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify([generatePersonSchema(locale), generateWebSiteSchema()]),
					}}
				/>
				<meta
					name="color-scheme"
					content="light dark"
				/>
			</head>
			<body
				className={`${Logo.variable} ${Heading.variable} ${Text.variable} ${Small.variable} ${SmallItalic.variable} antialiased flex min-h-screen selection:bg-(--primary) selection:text-(--selector-txt) `}>
				<SpeedInsights />
				{googleAnalytics && (
					<Suspense fallback={null}>
						<GoogleAnalytics GA_MEASUREMENT_ID={googleAnalytics} />
					</Suspense>
				)}
				<NextIntlClientProvider messages={messages}>
					<Providers>
						<header className="flex flex-row max-w-dvw">
							<Sidenav />
						</header>
						<main className="relative flex flex-1 justify-center flex-col overflow-hidden pb-5 mt-9">
							<TransitionOverlay />
							<div
								id="main"
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
