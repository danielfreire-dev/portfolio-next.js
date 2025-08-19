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
		let fillClass: string;
		switch (data.name) {
			case "next.js":
				fillClass = " fill-(--nextjs-fill)";
				break;
			case "HTML5":
				fillClass = " fill-(--html-fill)";
				break;
			case "gitHub":
				fillClass = " fill-(--github-fill)";
				break;
			default:
				fillClass = "";
		}
		console.log("fillClass", fillClass);
		return (
			<div
				className="flex flex-col flex-nowrap justify-items-center justify-center items-center bg-(--surface) py-7 px-9 m-4"
				key={nanoid()}
			>
				<a
					href={data.link}
					className="justify-items-center hover:scale-140 delay-150 ease-in duration-400"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						src={data.logo}
						alt={`${data.name} logo shadow-xl`}
						width={100}
						height={50}
						className={`mb-2${fillClass}`}
					/>
					<p className="capitalize">{data.name}</p>
				</a>
			</div>
		);
	});

	return techstackMap;
};

export default TechCards;
