import type { Metadata } from "next";

import { kolker, montserrat, lusitana } from "@/app/ui/fonts";
import "./globals.css";
import Sidenav from "./ui/Components/Sidenav";

export const metadata: Metadata = {
	title: {
		template: "%s | Daniel Freire",
		default: "Daniel Freire's Portfolio",
	},
	description: "Daniel Freire's Portfolio",
	/* metadataBase: new URL("https://next-learn-dashboard.vercel.sh"), */
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	/* gives user language. If not pt -> english */
	let userLanguage = navigator.language;

	return (
		<html lang="en">
			<body
				className={`${montserrat.className} ${lusitana.className} ${kolker.className} antialiased flex  items-center  min-h-screen `}
			>
				<Sidenav />
				<main className="flex-1 ml-64 p-6 flex-col gap-[32px] items-center sm:items-start">
					{children}
				</main>
			</body>
		</html>
	);
}
