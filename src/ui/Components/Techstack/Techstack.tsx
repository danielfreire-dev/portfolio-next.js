"use client";
import { useTranslations } from "next-intl";
import TechCards from "./TechCards";
import { TechGroups } from "./TechGroups";

/**
 * Tech stack section.
 *
 * Renders a heading and a grid of technology cards sourced from translation
 * data. Each card displays an SVG icon and the technology name.
 */
const Techstack = () => {
	const tech = useTranslations();
	const categories = tech.raw("techCategories");
	const title = useTranslations("home");
	return (
		<>
			<h2 className="mt-7 text-3xl font-bold text-center">{title("techstack")}</h2>
			<div
				className="md:alternating-row flex-wrap flex-col justify-center gap-8 mx-1"
				id="stack-container">
				{/* <TechCards tech={tech.raw("tech")} /> */}
				<TechGroups
					tech={tech.raw("tech")}
					category={"Languages"}
				/>
				<TechGroups
					tech={tech.raw("tech")}
					category={"Front End"}
				/>
				<TechGroups
					tech={tech.raw("tech")}
					category={"Back End"}
				/>
				<TechGroups
					tech={tech.raw("tech")}
					category={"State Management"}
				/>
				<TechGroups
					tech={tech.raw("tech")}
					category={"AI, Data and Visualization"}
				/>
				<TechGroups
					tech={tech.raw("tech")}
					category={"Databases"}
				/>
				<TechGroups
					tech={tech.raw("tech")}
					category={"Testing"}
				/>
				<TechGroups
					tech={tech.raw("tech")}
					category={"CI / CD"}
				/>
				<TechGroups
					tech={tech.raw("tech")}
					category={"Tools & DevOps"}
				/>
				<TechGroups
					tech={tech.raw("tech")}
					category={"Hosting"}
				/>
				<TechGroups
					tech={tech.raw("tech")}
					category={"Data Formats"}
				/>
			</div>
		</>
	);
};

export default Techstack;
