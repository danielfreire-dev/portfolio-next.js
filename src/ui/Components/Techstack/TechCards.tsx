import { useTranslations } from "next-intl";
import * as SVGs from "../svgs";

/** A single technology item displayed in the tech stack. */
interface TechItem {
	/** URL to the technology's website. */
	link: string;
	/** Path to a fallback logo image. */
	logo: string;
	/** Display name of the technology. */
	name: string;
	/** Key referencing an SVG component in the `svgs` barrel export. */
	svgr: string;
}

/** Props for the tech cards grid. */
interface TechCardsProps {
	tech: TechItem[];
}

/**
 * Tech stack cards grid.
 *
 * Renders a collection of technology cards, each displaying an SVG icon and
 * name. Icons are resolved dynamically from the `svgs` barrel export using
 * the `svgr` key. Falls back to a console warning if no matching SVG
 * component is found.
 */
const TechCards = ({ tech }: TechCardsProps) => {
	const t = useTranslations("svgTitles");
	const techstackMap = tech.map((data) => {
		const SvgComponent = SVGs[data.svgr as keyof typeof SVGs];

		if (!SvgComponent) {
			console.warn(`No SVG component found for: ${data.name}`);
			return null;
		}

		return (
			<a
				href={data.link}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={`${data.name} - ${t("opensInNewTab")}`}
				key={data.name}
				className="block hover:scale-133 delay-150 ease-in duration-400 ">
				<div className="py-7 px-9 surface-cards flex flex-col flex-nowrap justify-items-center">
					<SvgComponent
						alt={`${data.name} logo`}
						title={t(data.svgr) ?? undefined}
					/>

					<p className="capitalize mt-1.5 self-center">{data.name}</p>
				</div>
			</a>
		);
	});

	return <>{techstackMap}</>;
};

export default TechCards;
