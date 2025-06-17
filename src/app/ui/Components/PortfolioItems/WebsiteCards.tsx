import data from "@/app/ui/JSONs/text.json";
import { nanoid } from "nanoid";
import Image from "next/image";

const WebsiteCards = () => {
	const websiteMap = data["en-us"].portfolio.websites.map((item) => {
		return (
			<div className="" key={nanoid()}>
				<Image src={item.src} alt={item.title} width={400} height={400} />
				<h3>{item.title}</h3>
				<small>{item.summary}</small>
			</div>
		);
	});

	const projectsMap = data["en-us"].portfolio.projects.map((item) => {
		return (
			<div className="" key={nanoid()}>
				<Image src={item.src} alt={item.title} width={400} height={400} />
				<h3>{item.title}</h3>
				<small>{item.summary}</small>
			</div>
		);
	});

	return (
		<>
			<h2>Websites</h2>
			{websiteMap}
			<h2>Projects</h2>
			{projectsMap}
		</>
	);
};

export default WebsiteCards;
