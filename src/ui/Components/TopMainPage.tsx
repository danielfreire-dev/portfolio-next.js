import { useTranslations } from "next-intl";
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
			<div className="justify-center px-10 lg:px-0 text-center focus-in-expand">
				<h2 className="title capitalize">{array[randomIndex].title}</h2>
				<div className="text mt-2">{array[randomIndex].description}</div>
			</div>
		);
	};

	return (
		<div className="mx-auto l:pr-20 flex flex-nowrap flex-row justify-center items-center xl:gap-7 bg-radial-[at_84%_50%] from-(--primary)/20 via-(--accent1)/5 to-transparent to-66%">
			{getRandomItem(t.raw("topMainPage"))}

			<Suspense>
				<RotatingEarth
					width={500}
					height={500}
					backgroundColor="rgba(0,0,0,0)"
					className="hidden md:block"
					globeImageUrl="/images/globes/earth-blue-marble.png"
				/>
			</Suspense>
		</div>
	);
};
export default TopMainPage;
