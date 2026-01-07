import { nanoid } from "nanoid";
import * as SVGs from "../svgs";
import Image from "next/image";

interface TechItem {
	link: string;
	logo: string;
	name: string;
	svgr: string;
}

interface TechCardsProps {
	tech: TechItem[];
}

const TechCards = ({ tech }: TechCardsProps) => {
	const techstackMap = tech.map((data) => {
		const SvgComponent = SVGs[data.svgr as keyof typeof SVGs];

		if (!SvgComponent) {
			console.warn(`No SVG component found for: ${data.name}`);
			return null;
		}

		return (
			<div className="py-7 px-9 m-4 surface-cards" key={nanoid()}>
				<a
					href={data.link}
					className="flex flex-col flex-nowrap justify-items-center hover:scale-140 delay-150 ease-in duration-400"
					target="_blank"
					rel="noopener noreferrer"
				>
					<SvgComponent alt={`${data.name} logo`} />

					<p className="capitalize mt-1.5 self-center">{data.name}</p>
				</a>
			</div>
		);
	});

	return <>{techstackMap}</>;
};

export default TechCards;

{
	/* <Image
		src={data.logo}
		alt={`${data.name} logo`}
		width={100}
		height={50}
		className={`mb-2 ${fillClass} text-amber-300 `}
		/> */
}
