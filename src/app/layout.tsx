import type { Metadata } from "next";
import { kolker, montserrat, lusitana } from "@/app/ui/fonts";
import "./globals.css";
import SidenavContainer from "./ui/Components/Sidenav/SidenavContainer";

import { AppProvider } from "./ui/Components/AppContext";

export const metadata: Metadata = {
	title: {
		template: "Daniel Freire | %s",
		default: "Daniel Freire's Webpage",
	},
	description: "Daniel Freire's Portfolio",
	/* metadataBase: new URL("https://next-learn-dashboard.vercel.sh"), */
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${montserrat.className} ${lusitana.className} ${kolker.className} antialiased flex min-h-screen`}
			>
				<AppProvider>
					<header className="flex">
						<SidenavContainer />
					</header>
					<main className="flex w-max flex-col overflow-hidden">
						{children}
					</main>
				</AppProvider>
			</body>
		</html>
	);
}
