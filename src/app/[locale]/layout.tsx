import type { Metadata } from "next";
import { kolker, montserrat, lusitana } from "@/ui/fonts";
import "./globals.css";
import Sidenav from "@/ui/Components/Sidenav/Sidenav";

import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import Dock from "@/ui/Components/Sidenav/Dock";

export const metadata: Metadata = {
	title: {
		template: "%s | Daniel Freire",
		default: "Daniel Freire",
	},
	description: "Daniel Freire's Portfolio",
};

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
				className={`${montserrat.className} ${lusitana.className} ${kolker.className} antialiased flex min-h-screen`}
			>
				<NextIntlClientProvider messages={messages}>
					<header className="flex">
						<Sidenav />
					</header>
					<main className="flex flex-1 justify-center flex-col overflow-hidden pb-[60px] lg:pb-0">
						{children}
						<Dock />
					</main>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
