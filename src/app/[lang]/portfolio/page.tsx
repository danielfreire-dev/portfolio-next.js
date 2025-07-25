import Cta from "../../../ui/Components/CtA/Cta";
import WebsiteCards from "../../../ui/Components/PortfolioItems/WebsiteCards";
import { Metadata } from "next";
import { Suspense } from "react";
import { Locale } from "@/src/i18n/i18n-config";
import { getDictionary } from "@/src/i18n/get-dictionary";

export const metadata: Metadata = {
	title: "Portfolio",
};

const Portfolio = async (props: { params: Promise<{ lang: Locale }> }) => {
	const { lang } = await props.params;

	const dictionary = await getDictionary(lang);
	return (
		<>
			<h2>{dictionary.portfolio.pageTitle}!</h2>
			<Suspense fallback={<div>Loading...</div>}>
				<WebsiteCards portfolio={dictionary.portfolio} />
			</Suspense>
			<Suspense fallback={<div>Loading...</div>}>
				<Cta dictionary={dictionary} />
			</Suspense>
		</>
	);
};

export default Portfolio;
