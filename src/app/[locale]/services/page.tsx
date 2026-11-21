import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { use } from "react";
import { Locale, useTranslations } from "next-intl";
import Services from "@/ui/Components/Services";
import { generateBreadcrumbSchema } from "@/ui/Components/StructuredData";
import { getCanonicalUrl } from "@/i18n/alternates";
import { buildPageMetadata } from "@/i18n/pageMetadata";

interface Props {
	params: Promise<{ locale: Locale }>;
}

/**
 * Generates localized metadata for the services listing page.
 *
 * Fetches translated title and description based on the resolved locale
 * from the route params, and sets canonical and Open Graph data.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({
		locale: locale,
		namespace: "metadata",
	});

	return buildPageMetadata({
		href: "/services",
		locale,
		title: t("seoTitle.services"),
		description: t("description.services"),
		keywords: [
			"web development services",
			"AI solutions",
			"custom software",
			"LLM integration",
			"technical consulting",
			"custom CRM",
			"AI agents",
		],
	});
}

/**
 * Services listing page — an introduction (who the services are for and
 * how projects run) followed by the shared {@link Services} card grid.
 *
 * Route: /[locale]/services
 */
const ServicesPage = ({ params }: Props) => {
	const { locale } = use(params);
	setRequestLocale(locale);
	const m = useTranslations("metadata.title");
	const b = useTranslations("breadcrumbs");
	const p = useTranslations("servicesPage");
	const intro = p.raw("intro") as string[];
	const steps = p.raw("steps") as Array<{ title: string; text: string }>;

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbSchema([
							{ name: b("home"), href: getCanonicalUrl("/", locale) },
							{ name: m("services"), href: getCanonicalUrl("/services", locale) },
						]),
					),
				}}
			/>
			<Services headingLevel="h1">
				<div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-4">
					{intro.map((paragraph) => (
						<p
							key={paragraph.slice(0, 40)}
							className="text-base leading-relaxed text-(--text-secondary)">
							{paragraph}
						</p>
					))}
				</div>
			</Services>

			<section
				className="mx-auto max-w-3xl px-4 sm:px-6 mb-6"
				aria-labelledby="how-i-work">
				<h2
					id="how-i-work"
					className="text-2xl! mb-4">
					{p("stepsTitle")}
				</h2>
				<ol className="space-y-3 list-decimal list-inside">
					{steps.map((step) => (
						<li
							key={step.title}
							className="text-base text-(--text-secondary)">
							<strong className="text-(--text-primary)">{step.title}.</strong> {step.text}
						</li>
					))}
				</ol>
			</section>
		</>
	);
};

export default ServicesPage;
