import { useTranslations } from "next-intl";
import Image from "next/image";
import RotatingEarth from "./RotatingEarth";
import { Suspense } from "react";

interface topMainPage {
	title: string;
	description: string;
}

const TopMainPage = () => {
	const t = useTranslations();

	const getRandomItem = (array: topMainPage[]) => {
		if (array.length === 0) {
			return null;
		}
		const randomIndex = Math.floor(Math.random() * array.length);
		return (
			<div className=" justify-center lg:px-0 text-center">
				<h2 className="title capitalize">{array[randomIndex].title}</h2>
				<div className="text mt-2">{array[randomIndex].description}</div>
			</div>
		);
	};

	return (
		<div className="container px-10 w-dvw flex flex-wrap flex-row lg:grid lg:grid-cols-2 lg:items-center  ">
			{getRandomItem(t.raw("topMainPage"))}
			<div>
				<Suspense fallback="Loading globe...">
					<RotatingEarth
						backgroundColor="rgba(0,0,0,0)"
						className="hidden lg:block"
						globeImageUrl="/images/globes/Blank_Map_of_The_World_Equirectangular_Projection.png"
					/>
				</Suspense>
			</div>
		</div>
	);
};
export default TopMainPage;
