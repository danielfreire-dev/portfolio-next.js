import techstackData from "@/app/ui/JSONs/techstack.json";
import Image from "next/image";
import { nanoid } from "nanoid";
import { TechCardProps } from "@/app/ui/types";

const TechCard: React.FC<TechCardProps> = () => {
	const techstackMap = techstackData.tech.map((data) => {
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
						alt={data.tech}
						width={100}
						height={5}
						className="mb-2 "
					/>
					<p>{data.tech}</p>
				</a>
			</div>
		);
	});

	return techstackMap;
};

export default TechCard;
