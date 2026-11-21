"use client";
import { useTranslations } from "next-intl";
import { TechGroups, type Tech, type TechCategory } from "./TechGroups";

/** A tech-stack category as defined in the translation files. */
interface CategoryMessage {
	/** Stable identifier (same in every locale). */
	id: string;
	/** Translated heading shown to visitors. */
	label: string;
	/** Display order. */
	order: number;
}

/**
 * Maps each category id to the English key used in `tech[].categories`.
 *
 * Tech items are tagged with these English keys in every locale, so they are
 * used for filtering, while the translated `label` is used for display.
 */
const CATEGORY_KEYS: Record<string, TechCategory> = {
	languages: "Languages",
	"front-end": "Front End",
	"back-end": "Back End",
	"state-management": "State Management",
	"ai-data-viz": "AI, Data and Visualization",
	databases: "Databases",
	testing: "Testing",
	"ci-cd": "CI / CD",
	"tools-devops": "Tools & DevOps",
	hosting: "Hosting",
	"data-formats": "Data Formats",
};

/**
 * Tech stack section.
 *
 * Renders a heading and one group per category, in the order defined by the
 * translation data, with translated category headings.
 */
const Techstack = () => {
	const t = useTranslations();
	const title = useTranslations("home");
	const tech = t.raw("tech") as Tech[];
	const categories = [...(t.raw("techCategories") as CategoryMessage[])].sort((a, b) => a.order - b.order);

	return (
		<>
			<h2 className="mt-7 text-3xl font-bold text-center">{title("techstack")}</h2>
			<div
				className="md:alternating-row flex-wrap flex-col justify-center gap-8 mx-1"
				id="stack-container">
				{categories.map(
					({ id, label }) =>
						CATEGORY_KEYS[id] && (
							<TechGroups
								key={id}
								tech={tech}
								category={CATEGORY_KEYS[id]}
								label={label}
							/>
						),
				)}
			</div>
		</>
	);
};

export default Techstack;
