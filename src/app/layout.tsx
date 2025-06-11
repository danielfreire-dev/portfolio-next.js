import type { Metadata } from "next";
import { useState } from "react";

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
	const [userLanguage, setUserLanguage] = useState(navigator.language);

	return (
		<html lang="en">
			<body
				className={`${montserrat.className} ${lusitana.className} ${kolker.className} antialiased flex  items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20`}
			>
				<Sidenav />
				<main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
					{children}
				</main>
			</body>
		</html>
	);
}
