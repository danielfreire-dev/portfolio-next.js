import type { Metadata } from "next";
import { kolker, montserrat, lusitana } from "./ui/fonts";
import "./globals.css";
import SidenavContainer from "./ui/Components/Sidenav/SidenavContainer";
import { i18n, type Locale } from "../../i18n-config";

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
	params: Promise<{ lang: Locale }>;
}) {
	const params = await props.params;

	const { children } = props;

	return (
		<html lang="en">
			<body
				className={`${montserrat.className} ${lusitana.className} ${kolker.className} antialiased flex min-h-screen`}
			>
				<header className="flex">
					<SidenavContainer />
				</header>
				<main className="flex w-max flex-col overflow-hidden">{children}</main>
			</body>
		</html>
	);
}
