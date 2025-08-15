import ClientSideAbout from "../../../ui/Components/ClientPage";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata({ params }: { params: any }): Promise<{
	title: string;
}> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "metadata" });

	return {
		title: t("about"),
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
