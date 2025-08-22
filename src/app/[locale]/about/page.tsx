import ClientSideAbout from "../../../ui/Components/ClientPage";
import { Suspense } from "react";
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
}> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata" });

	return {
		title: t("title.about"),
		description: t("description.about"),
	};
}

const About = async () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ClientSideAbout />
		</Suspense>
	);
};

export default About;
