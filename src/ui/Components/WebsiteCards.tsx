import { Dictionary } from "@/types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Suspense } from "react";
import { WebsiteCardSkeleton } from "./Skeletons";

/**
 * Portfolio cards section.
 *
 * Renders two collections ("websites" and "projects") from translation data.
 * Each item displays a title and screenshot (one shared link), demo/github
 * links, and a summary.
 * The internal `collectionMap` helper transforms a named translation key into
 * a list of card elements, keeping the JSX for both collections DRY.
 */
const WebsiteCards = () => {
	const t = useTranslations("portfolio");

	/**
	 * Maps a named translation collection ("websites" or "projects") to an
	 * array of portfolio card elements.
	 *
	 * Reads the raw translation array for the given key and renders each item
	 * as a card with an image, title, demo/GitHub links, and summary text.
	 * The first card in each collection is loaded eagerly (eager) to improve
	 * LCP; all subsequent cards use lazy loading. Each card is wrapped in
	 * Suspense with a `WebsiteCardSkeleton` fallback to avoid layout shift.
	 *
	 * @param items - The translation key identifying the collection.
	 * @returns An array of JSX card elements.
	 */
	const collectionMap = (items: "websites" | "projects") => {
		return t.raw(`${items}`).map((item: Dictionary["portfolio"]["websites" | "projects"][number], index: number) => (
			<Suspense
				fallback={<WebsiteCardSkeleton />}
				key={item.title}>
				<div className=" max-w-lg last:mr-0 mb-6 p-3 surface-cards">
					{/* One link for title + screenshot, so keyboard and screen-reader
					    users meet each project once instead of twice. */}
					<a
						href={item.link}
						target="_blank"
						rel="noopener noreferrer"
						className="group block overflow-hidden shadow-md"
						aria-label={`${item.title} - ${t("opensInNewTab")}`}>
						<h3 className="capitalize text-xl mb-1 group-hover:underline font-semibold">{item.title}</h3>
						<Image
							src={item.src}
							alt=""
							width={1600}
							height={900}
							className="transition-transform delay-150 duration-500 group-hover:scale-110 website-card-image"
							loading={`${index === 0 ? "eager" : "lazy"}`}
						/>
					</a>

					<div className="mt-4 box-border">
						<div className="flex justify-center gap-1 mb-1">
							<a
								href={item.link}
								target="_blank"
								rel="noopener noreferrer"
								className={`${item.link ? "" : "hidden"} demo hover:underline`}
								aria-label={`${item.demo} - ${t("opensInNewTab")}`}>
								{item.demo}
							</a>
							<a
								href={item.github}
								target="_blank"
								rel="noopener noreferrer"
								className={`${item.github ? "" : "hidden"} github hover:underline`}
								aria-label={`GitHub - ${t("opensInNewTab")}`}
								// eslint-disable-next-line i18next/no-literal-string
							>
								GitHub
							</a>
						</div>
						<small className="block text-(--text-tertiary) text-sm wrap-break-words mt-1">{item.summary}</small>
					</div>
				</div>
			</Suspense>
		));
	};

	return (
		<div className="mx-15 text-center flex flex-wrap flex-col justify-center">
			<h2>{t("websites-title")}</h2>
			<section className="flex flex-row flex-wrap justify-center gap-x-7 websites-title">
				{collectionMap("websites")}
			</section>
			<h2>{t("projects-title")}</h2>
			<section className="flex flex-row flex-wrap justify-center gap-x-7 projects-title">
				{collectionMap("projects")}
			</section>
		</div>
	);
};

export default WebsiteCards;
