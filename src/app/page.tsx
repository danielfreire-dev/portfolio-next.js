"use client";
import EmblaCarousel from "./ui/Components/Carousel/js/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";

import "./ui/Components/Carousel/css/embla-old.css";
/* import "./ui/Components/Carousel/css/embla.css"; */
/* import "./ui/Components/Carousel/css/base.css"; */
/* import "./ui/Components/Carousel/css/sandbox.css"; */
/* import "./ui/Components/Carousel/css/embla.css"; */
import { useAppContext } from "./ui/Components/AppContext";
import Techstack from "./ui/Components/Techstack/Techstack";
import Cta from "./ui/Components/CTA/Cta";
/* import Carousel from "./ui/Components/Carousel-DS/Carousel"; */
import data from "./ui/JSONs/text.json";
import FullHeightCarousel from "./ui/Components/fullHeightCarousel/FullHeightCarousel";

const OPTIONS: EmblaOptionsType = { loop: true };
const SLIDE_COUNT = 3;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

export const Home = () => {
	const { userLanguage } = useAppContext();
	/* const carousel = data[userLanguage].carousel; */

	return (
		<>
			{/* <EmblaCarousel slides={SLIDES} options={OPTIONS} /> */}
			{/* <Carousel slides={carousel} /> */}
			<FullHeightCarousel />
			<Techstack />
			<Cta />
		</>
	);
};

export default Home;
