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

/**
 * One tech-stack category: a heading and the technologies tagged with it.
 *
 * @param tech     - All technologies.
 * @param category - English category key used to filter `tech[].categories`.
 * @param label    - Translated heading (falls back to the key).
 */
export function TechGroups({ tech, category, label }: { tech: Tech[]; category: TechCategory; label?: string }) {
	const filteredTech = tech.filter((item) => item.categories.includes(category));

	if (filteredTech.length === 0) {
		return null;
	}

	return (
		<div className="group bg-(--surface-hover) max-w-99/100 alternating-row items-center justify-between gap-4 lg:gap-0">
			<h3 className="px-max py-1.5 text-2xl font-semibold mx-3 text-center lg:group-even:text-right lg:group-odd:text-left lg:whitespace-nowrap">
				{label ?? category}
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
