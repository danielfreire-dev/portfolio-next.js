import { useTranslations } from "next-intl";
import Image from "next/image";
import type { Dictionary } from "@/types";
import { Marquee } from "@/ui/Components/Marquee";
import { TransitionLink } from "@/ui/Components/Sidenav/TransitionLink";

type PortfolioItem = Dictionary["portfolio"]["websites"][number];

/**
 * "Selected work" — the portfolio page's client websites as small cards in a
 * right-to-left marquee, with a link to the full portfolio.
 *
 * Reads the same `portfolio.websites` translation data as the portfolio page
 * (`WebsiteCards`), so both stay in sync. The short list is repeated
 * (`minItemsPerCopy`) so the row always fills wide screens.
 */
const SelectedWork = () => {
	const t = useTranslations("home");
	const p = useTranslations("portfolio");
	const items = p.raw("websites") as PortfolioItem[];

	return (
		<section
			aria-labelledby="selected-work-title"
			className="mt-10">
			<Marquee
				items={items}
				getKey={(item) => item.title}
				pauseLabel={t("marqueePause")}
				secondsPerItem={6}
				minItemsPerCopy={9}
				header={
					<h2
						id="selected-work-title"
						className="text-3xl font-bold">
						{t("selectedWork.title")}
					</h2>
				}
				renderItem={(item, hidden) => (
					<a
						href={item.link}
						target="_blank"
						rel="noopener noreferrer"
						tabIndex={hidden ? -1 : undefined}
						aria-label={`${item.title} - ${p("opensInNewTab")}`}
						className="surface-cards flex flex-col w-60 sm:w-72 h-full p-2 hover:scale-[1.03] transition-transform duration-300">
						<Image
							src={item.src}
							alt=""
							width={320}
							height={180}
							loading="lazy"
							className="w-full aspect-video object-cover object-top"
						/>
						<span className="capitalize font-semibold mt-2">{item.title}</span>
						<span className="text-sm text-(--text-tertiary) line-clamp-2">{item.summary}</span>
					</a>
				)}
			/>
			<div className="flex justify-center">
				<TransitionLink
					href="/portfolio"
					className="font-semibold underline underline-offset-4 hover:no-underline hover:text-(--text-hover) mt-2">
					{t("selectedWork.link")} →
				</TransitionLink>
			</div>
		</section>
	);
};

export default SelectedWork;
