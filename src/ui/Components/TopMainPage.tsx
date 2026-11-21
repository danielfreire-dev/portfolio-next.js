import "@/ui/styles/hero.css";
import { useTranslations } from "next-intl";
import { DjangoRocket } from "./svgs/django-rocket";
import { TransitionLink } from "./Sidenav/TransitionLink";

/**
 * Hero section for the home page.
 *
 * Holds the page's only `<h1>`, written to match the home page's SEO title
 * (custom software, AI apps, fast websites), plus an identity line
 * (name and role), a short value statement and two calls to action
 * (contact, portfolio) that share the `.hero-button` look from `hero.css`.
 *
 * The rocket illustration is decorative and hidden below `md` by `.figure`.
 */
const TopMainPage = () => {
	const t = useTranslations("topMainPage");

	return (
		<section
			aria-labelledby="hero-title"
			className="grid md:grid-cols-[3fr_2fr] items-center gap-6 xl:gap-10 px-6 sm:px-10 lg:px-4">
			<div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
				<p className="text-sm font-semibold uppercase tracking-wide ">{t("eyebrow")}</p>
				<h1
					id="hero-title"
					className="text-3xl! sm:text-4xl! xl:text-5xl! font-bold leading-tight text-balance">
					{t("title")}
				</h1>
				<p className="text max-w-prose text-(--text-hover)">{t("description")}</p>
				<div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
					<TransitionLink
						href="/contact"
						inputdata="CtA"
						className="hero-button">
						{t("primaryCta")}
					</TransitionLink>
					<TransitionLink
						href="/portfolio"
						className="hero-button">
						{t("secondaryCta")}
					</TransitionLink>
				</div>
			</div>

			<DjangoRocket aria-hidden="true" />
		</section>
	);
};
export default TopMainPage;
