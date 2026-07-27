import { useTranslations } from "next-intl";
import TechCards from "./TechCards";
import { Suspense } from "react";

/**
 * Tech stack section.
 *
 * Renders a heading and a grid of technology cards sourced from translation
 * data. Each card displays an SVG icon and the technology name.
 */
const Techstack = () => {
	const tech = useTranslations();
	const title = useTranslations("home");
	return (
		<>
			<h2 className="mt-7 text-3xl font-bold text-center">{title("techstack")}</h2>
			<div
				className="flex flex-wrap flex-row justify-center gap-8 mx-1"
				id="stack-container">
				<TechCards tech={tech.raw("tech")} />
			</div>
		</>
	);
};

export default Techstack;
