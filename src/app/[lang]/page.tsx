import Techstack from "@/ui/Components/Techstack/Techstack";
import Cta from "@/ui/Components/CtA/Cta";
import Slider from "@/ui/Components/Carousel/Carousel";

import { useTranslations } from "next-intl";

export default function HomePage() {
	return (
		<>
			<Slider />
			<Techstack />

			<Cta />
		</>
	);
}
