import { useTranslations } from "next-intl";
import Image from "next/image";
import type { Tech } from "@/ui/Components/Techstack/TechGroups";
import { Marquee } from "@/ui/Components/Marquee";
import Nextjs from "@/ui/Components/svgs/nextjs.svg";
import Github from "@/ui/Components/svgs/github.svg";

/**
 * Logos whose colours come from the theme (`currentColor` /
 * `var(--github-fill)`). Those only work inline, so they are rendered as SVG
 * components; every other logo is a cacheable image file, which keeps the
 * home page HTML light.
 */
const THEMED_LOGOS: Record<string, typeof Nextjs> = {
	nextjs: Nextjs,
	github: Github,
	githubpages: Github,
};

/**
 * Technology logos in a left-to-right marquee — the reverse direction of
 * {@link SelectedWork} directly above it. Reads the same `tech` translation
 * data as the About page's tech stack.
 */
const TechMarquee = () => {
	const t = useTranslations("home");
	const tech = useTranslations().raw("tech") as Tech[];

	return (
		<section
			aria-labelledby="tech-marquee-title"
			className="mt-4">
			<Marquee
				items={tech}
				getKey={(item) => item.id}
				pauseLabel={t("marqueePause")}
				secondsPerItem={2.5}
				reverse
				header={
					<h2
						id="tech-marquee-title"
						className="text-xl! font-semibold!">
						{t("techMarquee.title")}
					</h2>
				}
				renderItem={(item, hidden) => {
					const Logo = THEMED_LOGOS[item.id];
					return (
						<a
							href={item.link}
							target="_blank"
							rel="noopener noreferrer"
							tabIndex={hidden ? -1 : undefined}
							className="surface-cards flex items-center gap-2 h-full px-3 py-2 whitespace-nowrap hover:scale-105 transition-transform duration-300">
							{Logo ?
								<Logo
									className="w-7 h-7"
									aria-hidden="true"
								/>
							:	<Image
									src={item.logo}
									alt=""
									width={28}
									height={28}
									unoptimized
									loading="lazy"
									className="w-7 h-7 object-contain"
								/>
							}
							<span className="capitalize text-sm font-medium">{item.name}</span>
						</a>
					);
				}}
			/>
		</section>
	);
};

export default TechMarquee;
