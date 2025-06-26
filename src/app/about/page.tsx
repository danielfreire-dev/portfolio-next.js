import data from "@/app/ui/JSONs/text.json";
import Image from "next/image";
import Cta from "../ui/Components/CTA/Cta";
import { Metadata } from "next";
import { UserLanguageType, SidenavProps } from "../ui/types";

export const metadata: Metadata = {
	title: "About",
};

export const About = ({ userLanguage, onLanguageChange }: SidenavProps) => {
	const about = data["en-US"].about;

	return (
		<>
			<div className="grid grid-cols-2 gap-6">
				<Image
					src={about.image}
					alt="drawing of Daniel"
					width={1000}
					height={1000}
				/>
				<div>
					<h2>{about.title1}</h2>
					<h3>{about.title2}</h3>
					<p>{about.paragraph1}</p>
					<p>{about.paragraph2}</p>
					<h3>{about.title3}</h3>
					<p>{about.paragraph3}</p>
					<p>{about.paragraph4}</p>
					<h3>{about.title4}</h3>
					<p>{about.paragraph5}</p>
					<p>{about.paragraph6}</p>
					<h3>{about.title5}</h3>
					<p>{about.paragraph7}</p>
				</div>
			</div>
			<Cta />
		</>
	);
};

export default About;
