"use client";

import { useAppContext } from "./ui/Components/AppContext";
import Techstack from "./ui/Components/Techstack/Techstack";
import Cta from "./ui/Components/CTA/Cta";

/* import data from "./ui/JSONs/text.json"; */
import carouselData from "./ui/JSONs/carousel.json";
import Slider from "./ui/Components/Carousel/Carousel";

export const Home = () => {
	const { userLanguage } = useAppContext();

	return (
		<>
			<Slider items={carouselData.carousel} icons={carouselData.icons} />
			<Techstack />
			<Cta />
		</>
	);
};

export default Home;
