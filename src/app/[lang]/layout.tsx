import type { Metadata } from "next";
import { kolker, montserrat, lusitana } from "../../ui/fonts";
import "./globals.css";
import Sidenav from "../../ui/Components/Sidenav/Sidenav";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
	title: {
		template: "Daniel Freire | %s",
		default: "Daniel Freire's Webpage",
	},
	description: "Daniel Freire's Portfolio",
	/* metadataBase: new URL("https://next-learn-dashboard.vercel.sh"), */
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

	return (
		<html lang={locale}>
			<body
				className={`${montserrat.className} ${lusitana.className} ${kolker.className} antialiased flex min-h-screen`}
			>
				<header className="flex">
					<NextIntlClientProvider>
						<Sidenav />
					</NextIntlClientProvider>
				</header>
				<main className="flex flex-1 justify-center flex-col overflow-hidden">
					<NextIntlClientProvider> {children} </NextIntlClientProvider>
				</main>
			</body>
		</html>
	);
}
