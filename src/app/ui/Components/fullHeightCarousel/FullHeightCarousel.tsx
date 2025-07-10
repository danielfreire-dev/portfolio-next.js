import Image from "next/image";
import { CarouselItem } from "@/app/ui/types";
import "./carousel.css";
import data from "@/app/ui/JSONs/text.json";

const carouselItems: CarouselItem[] = [
	{
		id: 1,
		title: "Lossless Youths",
		description:
			"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.",
		imageUrl: "/images/Carousel/dP3N4qnEZ4tCTCLq59iysd.jpg",
		alt: "Abstract futuristic cityscape",
	},
	{
		id: 2,
		title: "Estrange Bond",
		description:
			"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.",
		imageUrl: "/images/Carousel/tc0aqpv92pn21.jpg",
		alt: "Mountain landscape with fog",
	},
	{
		id: 3,
		title: "The Gate Keeper",
		description:
			"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.",
		imageUrl: "/images/Carousel/bio_north.jpg",
		alt: "Industrial laboratory interior",
	},
	{
		id: 4,
		title: "Last Trace Of Us",
		description:
			"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.",
		imageUrl: "/images/Carousel/878/878663.jpg",
		alt: "Abandoned building with overgrowth",
	},
	{
		id: 5,
		title: "Urban Decay",
		description:
			"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.",
		imageUrl: "/images/Carousel/simon_stalenhag_the_electric_state_6.jpg",
		alt: "Futuristic robot in field",
	},
	{
		id: 6,
		title: "The Migration",
		description:
			"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore fuga voluptatum, iure corporis inventore praesentium nisi. Id laboriosam ipsam enim.",
		imageUrl: "/images/Carousel/simon-december1994.jpg",
		alt: "Snowy forest landscape",
	},
];

const FullHeightCarousel = () => {
	function handlePrevBtn() {
		console.log("prev");
	}
	function handleNxtBtn() {
		console.log("next");
	}

	return (
		<div className="carousel-container">
			<div className="carousel">
				<ul className="slider">
					{carouselItems.map((item) => (
						<li key={item.id} className="item">
							<div className="image-container">
								<Image
									src={item.imageUrl}
									alt={item.alt}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									className="carousel-image"
									priority={item.id <= 2}
								/>
							</div>
							<div className="content">
								<h2 className="title">{item.title}</h2>
								<p className="description">{item.description}</p>
								<button>Read More</button>
							</div>
						</li>
					))}
				</ul>
				<nav className="nav">
					<Image
						src={data["en-US"].icons.leftarrow.src}
						alt={data["en-US"].icons.leftarrow.alt}
						width={24}
						height={24}
						onClick={handlePrevBtn}
					/>
					<Image
						src={data["en-US"].icons.rightarrow.src}
						alt={data["en-US"].icons.rightarrow.alt}
						onClick={handleNxtBtn}
						width={24}
						height={24}
					/>
				</nav>
			</div>
		</div>
	);
};

export default FullHeightCarousel;
