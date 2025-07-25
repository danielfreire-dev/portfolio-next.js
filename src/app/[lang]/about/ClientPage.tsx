import Image from "next/image";
import Cta from "../../../ui/Components/CtA/Cta";
import { Suspense } from "react";
import { Dictionary } from "@/src/types";

interface AboutItems {
	image: string;
	paragraph1: string;
	paragraph2: string;
	paragraph3: string;
	paragraph4: string;
	paragraph5: string;
	paragraph6: string;
	paragraph7: string;
	title1: string;
	title2: string;
	title3: string;
	title4: string;
	title5: string;
}
interface AboutProps {
	about: AboutItems;
	dictionary: Dictionary;
}

const ClientSideAbout = ({ about, dictionary }: AboutProps) => {
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
			<Suspense fallback={<div>Loading...</div>}>
				<Cta dictionary={dictionary} />
			</Suspense>
		</>
	);
};

export default ClientSideAbout;
