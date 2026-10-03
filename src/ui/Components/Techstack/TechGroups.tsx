/* import { useTranslations } from "next-intl"; */
import { TechItem } from "./TechItem";

/* const t = useTranslations();
const categories = t.raw("techCategories");
const tech = t.raw("tech"); */

export type Tech = {
	id: string;
	link: string;
	logo: string;
	name: string;
	svgr: string;
	categories: string[];
};

export type TechCategory =
	| "Languages"
	| "Front End"
	| "Back End"
	| "State Management"
	| "AI, Data and Visualization"
	| "Databases"
	| "Testing"
	| "CI / CD"
	| "Tools & DevOps"
	| "Hosting"
	| "Data Formats";

export function TechGroups({ tech, category }: { tech: Tech[]; category: TechCategory }) {
	const filteredTech = tech.filter((item) => item.categories.includes(category));

	if (filteredTech.length === 0) {
		return null;
	}

	return (
		<div className="group bg-(--surface-hover) w-full alternating-row items-center justify-between gap-4 lg:gap-0">
			<h3 className="px-max py-1.5 text-2xl font-semibold mx-3 text-center lg:group-even:text-right lg:group-odd:text-left lg:whitespace-nowrap">
				{category}
			</h3>
			<ul className="flex flex-wrap justify-center lg:group-odd:justify-end lg:group-even:justify-start gap-4 bg-(--surface) p-4  w-full">
				{filteredTech.map((item) => (
					<TechItem
						key={`${item.id} + ${category}`}
						tech={item}
					/>
				))}
			</ul>
		</div>
	);
}
