import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import Sidenav from "@/ui/Components/Sidenav/Sidenav";

import { NextIntlClientProvider, hasLocale, Locale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import Dock from "@/ui/Components/Sidenav/Dock";
import { useTranslations } from "next-intl";
import { Providers } from "@/ui/Components/CookieBanner";

/* Metadata */
export const metadata: Metadata = {
	title: {
		template: "%s | Daniel Freire",
		default: "Daniel Freire",
	},
	description: "Daniel Freire's Portfolio",
};

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
			<body
				className={`${Logo.variable} ${Heading.variable} ${Text.variable} ${Small.variable} ${SmallItalic.variable}  antialiased flex min-h-screen`}
			>
				<NextIntlClientProvider messages={messages}>
					<Providers>
						<header className="flex">
							<Sidenav />
						</header>
						<main className="flex flex-1 justify-center flex-col overflow-hidden pb-[60px] lg:pb-0">
							{children}
							<Dock />
						</main>
					</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
