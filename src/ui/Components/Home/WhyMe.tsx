import { useTranslations } from "next-intl";
import { TransitionLink } from "@/ui/Components/Sidenav/TransitionLink";

/**
 * "Why work with me" — a short teaser of the marketing-to-development story
 * told in full on the About page, with three differentiators and a link to
 * About.
 */
const WhyMe = () => {
	const t = useTranslations("home.whyMe");
	const points = t.raw("points") as { title: string; text: string }[];

	return (
		<section
			aria-labelledby="why-me-title"
			className="mt-10 mx-4 sm:mx-15">
			<h2
				id="why-me-title"
				className="text-3xl font-bold text-center">
				{t("title")}
			</h2>
			<p className="text max-w-prose mx-auto mt-3 text-center text-(--text-hover)">{t("lead")}</p>

			<ul className="grid gap-6 sm:grid-cols-3 mt-6 list-none">
				{points.map((point) => (
					<li
						key={point.title}
						className="surface-cards p-4">
						<h3 className="text-xl font-semibold">{point.title}</h3>
						<p className="text-sm text-(--text-tertiary) mt-1">{point.text}</p>
					</li>
				))}
			</ul>

			<div className="flex justify-center mt-4">
				<TransitionLink
					href="/about"
					className="font-semibold underline underline-offset-4 hover:no-underline hover:text-(--text-hover)">
					{t("link")} →
				</TransitionLink>
			</div>
		</section>
	);
};

export default WhyMe;
