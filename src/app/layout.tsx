import type { Metadata } from "next";
import { kolker, montserrat, lusitana } from "@/app/ui/fonts";
import "./globals.css";
import SidenavContainer from "./ui/Components/Sidenav/SidenavContainer";
import { UserLanguageType, SidenavProps } from "./ui/types";

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
				className={`${montserrat.className} ${lusitana.className} ${kolker.className} antialiased flex  items-center  min-h-screen `}
			>
				<SidenavContainer />
				<main className="flex-1 ml-64 p-6 flex-col gap-[32px] items-center sm:items-start">
					{children}
				</main>
			</body>
		</html>
	);
}
