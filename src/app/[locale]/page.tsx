import Techstack from "@/ui/Components/Techstack/Techstack";
import Cta from "@/ui/Components/CtA/Cta";
import Slider from "@/ui/Components/Carousel";

import { Locale, useTranslations } from "next-intl";
import { use } from "react";
import { setRequestLocale } from "next-intl/server";

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
