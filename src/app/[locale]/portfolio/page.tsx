import { useTranslations } from "next-intl";
import Cta from "../../../ui/Components/CtA/Cta";
import WebsiteCards from "../../../ui/Components/WebsiteCards";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Portfolio",
};

const Portfolio = () => {
	const t = useTranslations("portfolio");

	return (
		<>
			<h2>{t("pageTitle")}!</h2>
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
