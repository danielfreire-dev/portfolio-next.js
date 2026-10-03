import type { ElementType } from "react";
import * as SVGs from "../svgs";
import Image from "next/image";

export type Tech = {
	id: string;
	link: string;
	logo: string;
	name: string;
	svgr: string;
	categories: string[];
};

export function TechItem({ tech }: { tech: Tech }) {
	const SvgComponent = tech.svgr && tech.svgr in SVGs ? (SVGs as Record<string, ElementType>)[tech.svgr] : undefined;

	return (
		<li className="h-full list-none">
			<a
				href={tech.link}
				target="_blank"
				rel="noopener noreferrer"
				className="surface-cards flex flex-col items-center justify-center p-4 hover:scale-105 transition-transform duration-300 h-full text-center group">
				<div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-2">
					{SvgComponent ?
						<SvgComponent
							className="w-full h-full max-w-full max-h-full"
							aria-label={`${tech.name} logo`}
							role="img"
						/>
					:	<Image
							src={tech.logo}
							alt={`${tech.name} logo`}
							width={80}
							height={80}
							unoptimized
							className="max-h-full max-w-full object-contain"
						/>
					}
				</div>
				<p className="capitalize text-sm sm:text-base font-medium mt-auto">{tech.name}</p>
			</a>
		</li>
	);
}
