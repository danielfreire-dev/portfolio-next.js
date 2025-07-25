import TechCards from "./TechCards";

/* interface TechProps {
	dictionary: Dictionary;
} */

interface TechItem {
	link: string;
	logo: string;
	name: string;
}

interface TechCardsProps {
	techItems: TechItem[];
	title: string;
}

const Techstack = ({ techItems, title }: TechCardsProps) => {
	return (
		<>
			<h2 className="mt-7 text-3xl font-bold text-center">{title}</h2>
			<div className="stack-container flex flex-wrap flex-row justify-center">
				<TechCards tech={techItems} />
			</div>
		</>
	);
};

export default Techstack;
