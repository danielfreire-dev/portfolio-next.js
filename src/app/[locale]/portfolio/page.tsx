import { useTranslations } from "next-intl";
import Cta from "../../../ui/Components/CtA/Cta";
import WebsiteCards from "../../../ui/Components/WebsiteCards";
import { getTranslations } from "next-intl/server";

interface Params {
	locale: string;
}
export async function generateMetadata({
	params,
}: {
	params: Params;
}): Promise<{
	title: string;
	description: string;
}> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata" });

	return {
		title: t("title.portfolio"),
		description: t("description.portfolio"),
	};
}

const Portfolio = () => {
	const t = useTranslations("portfolio");

	return (
		<>
			<h2 className="capitalize mx-15 my-5">{t("pageTitle")}!</h2>

			<WebsiteCards />

			<Cta />
		</>
	);
};

export default Portfolio;
