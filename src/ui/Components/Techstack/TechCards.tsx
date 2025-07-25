import Image from "next/image";
import { nanoid } from "nanoid";

interface TechItem {
	link: string;
	logo: string;
	name: string;
}

interface TechCardsProps {
	tech: TechItem[];
}

const TechCards = ({ tech }: TechCardsProps) => {
	const techstackMap = tech.map((data) => {
		return (
			<div
				className="flex flex-col flex-nowrap justify-items-center justify-center items-center m-4 hover:scale-140 delay-150 ease-in duration-400"
				key={nanoid()}
			>
				<a
					href={data.link}
					className="justify-items-center"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						src={data.logo}
						alt={`${data.name} logo`}
						width={100}
						height={50}
						className="mb-2 "
					/>
					<p className="capitalize">{data.name}</p>
				</a>
			</div>
		);
	});

	return techstackMap;
};

export default TechCards;
