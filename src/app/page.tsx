import EmblaCarousel from "./ui/Components/Carousel/js/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";

//import "./ui/Components/Carousel/css/base.css";
import "./ui/Components/Carousel/css/sandbox.css";
import "./ui/Components/Carousel/css/embla.css";
import Techstack from "./ui/Components/Techstack/Techstack";
import Cta from "./ui/Components/CTA/Cta";

const OPTIONS: EmblaOptionsType = { loop: true };
const SLIDE_COUNT = 3;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

export const Home = () => {
	return (
		<>
			<h2>THIS IS HOME!</h2>
			<EmblaCarousel slides={SLIDES} options={OPTIONS} />
			<Techstack />
			<Cta />
		</>
	);
};

export default Home;
