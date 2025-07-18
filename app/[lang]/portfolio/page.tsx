import Cta from "../ui/Components/CTA/Cta";
import WebsiteCards from "../ui/Components/PortfolioItems/WebsiteCards";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Portfolio",
};

const Portfolio = () => {
	return (
		<>
			<h2>PORTFOLIO!</h2>
			<Suspense fallback={<div>Loading...</div>}>
				<WebsiteCards />
			</Suspense>
			<Suspense fallback={<div>Loading...</div>}>
				<Cta />
			</Suspense>
		</>
	);
};

export default Portfolio;
