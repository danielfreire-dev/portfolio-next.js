"use client";
import Techstack from "@/src/ui/Components/Techstack/Techstack";
import Cta from "@/src/ui/Components/CtA/Cta";
import Slider from "@/src/ui/Components/Carousel/Carousel";
import { Locale } from "@/src/i18n/i18n-config";
import { getDictionary } from "@/src/i18n/get-dictionary";

const Home = async (props: { params: Promise<{ lang: Locale }> }) => {
	const { lang } = await props.params;

	const dictionary = await getDictionary(lang);

	return (
		<>
			<Slider items={dictionary.carousel} icons={dictionary.icons} />
			<Techstack
				techItems={dictionary.tech}
				title={dictionary.home.techstack}
			/>

			<Cta dictionary={dictionary} />
		</>
	);
};

export default Home;
