import Image from "next/image";
import { nanoid } from "nanoid";
import * as SVGs from "../svgs";
import { Suspense } from "react";

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
			<div className="bg-(--surface) py-7 px-9 m-4" key={nanoid()}>
				<Suspense>
					<a
						href={data.link}
						className="flex flex-col flex-nowrap justify-items-center hover:scale-140 delay-150 ease-in duration-400"
						target="_blank"
						rel="noopener noreferrer"
					>
						<SvgComponent alt={`${data.name} logo`} />

						<p className="capitalize mt-1.5 self-center">{data.name}</p>
					</a>
				</Suspense>
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
						className={`mb-2${fillClass}`}
					/> */
}
