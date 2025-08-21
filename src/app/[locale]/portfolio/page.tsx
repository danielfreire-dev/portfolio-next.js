import { useTranslations } from "next-intl";
import Cta from "../../../ui/Components/CtA/Cta";
import WebsiteCards from "../../../ui/Components/WebsiteCards";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { WebsiteCardsSkeleton } from "@/ui/Components/Skeletons";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata({ params }: { params: any }): Promise<{
	title: string;
}> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata" });

	return {
		title: t("portfolio"),
	};
}

const Portfolio = () => {
	const t = useTranslations("portfolio");

	return (
		<>
			<h2 className="capitalize mx-15 my-5">{t("pageTitle")}!</h2>
			<Suspense fallback={<WebsiteCardsSkeleton />}>
				<WebsiteCards />
			</Suspense>
			<Suspense fallback={<WebsiteCardsSkeleton />}>
				<Cta />
			</Suspense>
		</>
	);
};

export default Portfolio;
