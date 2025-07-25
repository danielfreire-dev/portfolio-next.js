import type { Metadata } from "next";
import { kolker, montserrat, lusitana } from "../../ui/fonts";
import "./globals.css";
import SidenavContainer from "../../ui/Components/Sidenav/SidenavContainer";
import { i18n, type Locale } from "@/src/i18n/i18n-config";
import { getDictionary } from "@/src/i18n/get-dictionary";

export const metadata: Metadata = {
	title: {
		template: "Daniel Freire | %s",
		default: "Daniel Freire's Webpage",
	},
	description: "Daniel Freire's Portfolio",
	/* metadataBase: new URL("https://next-learn-dashboard.vercel.sh"), */
};

export async function generateStaticParams() {
	return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout(props: {
	children: React.ReactNode;
	params: { lang: Locale };
}) {
	const params = await props.params;
	const dictionary = await getDictionary(params.lang);

	const { children } = props;
	return (
		<html lang={params.lang}>
			<body
				className={`${montserrat.className} ${lusitana.className} ${kolker.className} antialiased flex min-h-screen`}
			>
				<header className="flex">
					<SidenavContainer dictionary={dictionary} />
				</header>
				<main className="flex flex-1 justify-center flex-col overflow-hidden">
					{children}
				</main>
			</body>
		</html>
	);
}
