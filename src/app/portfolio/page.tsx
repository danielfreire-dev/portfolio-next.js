import Cta from "../ui/Components/CTA/Cta";
import WebsiteCards from "../ui/Components/PortfolioItems/WebsiteCards";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Portfolio",
};
export const Portfolio = () => {
	return (
		<>
			<h2>PORTFOLIO!</h2>
			<WebsiteCards />
			<Cta />
		</>
	);
};

export default Portfolio;
