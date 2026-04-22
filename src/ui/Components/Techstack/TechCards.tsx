import { nanoid } from "nanoid";
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
  const techstackMap = tech.map((data) => {
    const SvgComponent = SVGs[data.svgr as keyof typeof SVGs];

    if (!SvgComponent) {
      console.warn(`No SVG component found for: ${data.name}`);
      return null;
    }

    return (
      <div className="py-7 px-9 m-4 surface-cards" key={nanoid()}>
        <a
          href={data.link}
          className="flex flex-col flex-nowrap justify-items-center hover:scale-140 delay-150 ease-in duration-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SvgComponent alt={`${data.name} logo`} />

          <p className="capitalize mt-1.5 self-center">{data.name}</p>
        </a>
      </div>
    );
  });

  return <>{techstackMap}</>;
};

export default TechCards;
