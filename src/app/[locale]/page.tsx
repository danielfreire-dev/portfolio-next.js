import Techstack from "@/ui/Components/Techstack/Techstack";
import Cta from "@/ui/Components/CtA/Cta";
import Slider from "@/ui/Components/Carousel";

import { Locale, useTranslations } from "next-intl";
import { use } from "react";
import { setRequestLocale } from "next-intl/server";
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
		title: t("title.home"),
		description: t("description.home"),
	};
}

interface Props {
	params: Promise<{ locale: Locale }>;
}

export default function HomePage({ params }: Props) {
	const { locale } = use(params);

	// Enable static rendering
	setRequestLocale(locale);

	const t = useTranslations();

	return (
		<>
			<Slider items={t.raw("carousel")} />
			<Techstack />
			<Cta />
		</>
	);
}
