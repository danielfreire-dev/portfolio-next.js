import { useTranslations } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Locale } from "next-intl";
import { TransitionLink } from "@/ui/Components/Sidenav/TransitionLink";
import { generateBreadcrumbSchema, generateServiceSchema } from "@/ui/Components/StructuredData";
import { getAllLocalizedSlugs, getLocalizedSlug, toEnglishSlug } from "@/i18n/serviceSlugs";
import { getCanonicalUrl } from "@/i18n/alternates";
import { buildPageMetadata } from "@/i18n/pageMetadata";

interface Props {
	params: Promise<{ locale: Locale; service: string }>;
}

/**
 * All localized slugs across every supported locale.
 *
 * Expands the canonical English slugs defined in `@/lib/serviceSlugs` into
 * their localized equivalents so `generateStaticParams` can pre-render every
 * service-detail page at build time.  The canonical list is shared with the
 * sitemap to keep the authority list in one place.
 */
const ALL_SLUGS: string[] = getAllLocalizedSlugs();

/**
 * Generates static route params for every known service slug,
 * enabling static site generation (SSG) for all detail pages.
 */
export function generateStaticParams() {
	return ALL_SLUGS.map((slug) => ({ service: slug }));
}

/**
 * Generates localized metadata for a service detail page.
 *
 * Looks up the service by slug in the locale's translations and builds
 * the page title, description, and Open Graph data from the service data.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale, service: slug } = await params;

	// Use getMessages to access the raw services array
	const messages = (await getMessages({ locale })) as {
		services: Array<{
			slug: string;
			title: string;
			text: string;
		}>;
	};

	const service = messages.services?.find((s) => s.slug === slug);

	if (!service) {
		return { title: "Service Not Found" };
	}

	// Resolve the canonical English slug so we can produce correct
	// per-locale hreflang alternates (each locale needs its own translation
	// of the slug, not the slug from the current locale).
	const englishSlug = toEnglishSlug(slug);

	return buildPageMetadata({
		href: { pathname: "/services/[service]", params: { service: slug } },
		locale,
		hrefForLocale: (cur) => ({
			pathname: "/services/[service]",
			params: { service: getLocalizedSlug(englishSlug, cur) },
		}),
		title: service.title,
		description: service.text,
		keywords: [
			"web development",
			"AI solutions",
			"custom software",
			"LLM integration",
			"technical consulting",
			"business software",
			"SEO audit",
		],
	});
}

/**
 * Service detail page — elaborates on a single service offering.
 *
 * Displays a hero section with the service icon and title, the full
 * long-form description, a feature/benefit bullet list, links to the
 * other services, a contextual contact link, and a back-link to the
 * services listing.
 *
 * Route: /[locale]/services/[service]
 */
const ServiceDetailPage = ({ params }: Props) => {
	const { locale, service: slug } = use(params);
	setRequestLocale(locale);

	const t = useTranslations();
	const services = t.raw("services") as Array<{
		slug: string;
		icon: string;
		iconLarge?: string;
		title: string;
		text: string;
		longDescription: string;
		features: string[];
	}>;

	const service = Array.isArray(services) ? services.find((s) => s.slug === slug) : undefined;

	if (!service) {
		notFound();
	}

	const otherServices = services.filter((s) => s.slug !== slug);
	const serviceHref = (serviceSlug: string) =>
		({ pathname: "/services/[service]", params: { service: serviceSlug } }) as const;
	const canonicalUrl = getCanonicalUrl(serviceHref(slug), locale);

	const descriptionParagraphs = service.longDescription.split("\n\n").filter(Boolean);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbSchema([
							{ name: t("breadcrumbs.home"), href: getCanonicalUrl("/", locale) },
							{ name: t("metadata.title.services"), href: getCanonicalUrl("/services", locale) },
							{ name: service.title, href: canonicalUrl },
						]),
					),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(generateServiceSchema(service.title, service.text, service.features, toEnglishSlug(slug), canonicalUrl)),
				}}
			/>
			<article className="mx-auto max-w-3xl px-4 sm:px-6">
				{/* Back link */}
				<TransitionLink
					href="/services"
					className="inline-flex items-center gap-1 text-sm text-(--text-tertiary) hover:text-(--text-primary) transition-colors mb-8 whitespace-nowrap">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						aria-hidden="true">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					{t("metadata.title.services")}
				</TransitionLink>

				{/* Hero section */}
				<header className="flex flex-col sm:flex-row items-center gap-6 mb-10">
					{service.iconLarge && (
						<div className="shrink-0">
							<Image
								src={service.iconLarge}
								alt={service.title}
								width={96}
								height={96}
								className="service-card-icon"
							/>
						</div>
					)}
					<h1 className="text-3xl sm:text-4xl font-bold capitalize text-center sm:text-left">{service.title}</h1>
				</header>

				{/* Long description */}
				<div className="space-y-4 mb-10">
					{descriptionParagraphs.map((paragraph) => (
						<p
							key={`${slug}-${paragraph.slice(0, 40)}`}
							className="text-base leading-relaxed text-(--text-secondary)">
							{paragraph}
						</p>
					))}
				</div>

				{/* Features list */}
				{service.features.length > 0 && (
					<section className="mb-10 surface-cards p-6">
						<h2 className="text-xl! font-semibold mb-4">
							{t("serviceDetail.featuresHeading")}
						</h2>
						<ul className="space-y-3 features-list">
							{service.features.map((feature) => (
								<li
									key={`${slug}-${feature}`}
									className="flex gap-3">
									<span className="text-base text-(--text-secondary)">{feature}</span>
								</li>
							))}
						</ul>
					</section>
				)}

				{/* Contextual contact link */}
				<p className="text-center text-base text-(--text-secondary) mb-10">
					{t("serviceDetail.ctaPrompt")}{" "}
					<TransitionLink
						href="/contact"
						className="underline font-semibold text-(--text) hover:text-(--primary-text)">
						{t("serviceDetail.ctaLink")}
					</TransitionLink>
				</p>

				{/* Other services */}
				{otherServices.length > 0 && (
					<nav
						className="mb-10"
						aria-labelledby="other-services">
						<h2
							id="other-services"
							className="text-xl! font-semibold mb-4">
							{t("serviceDetail.otherServices")}
						</h2>
						<ul className="flex flex-col gap-3">
							{otherServices.map((other) => (
								<li key={other.slug}>
									<TransitionLink
										href={serviceHref(other.slug)}
										className="related-service surface-cards flex items-start gap-4 p-4 hover:scale-[1.02] transition-transform duration-300 ease-in-out motion-reduce:transition-none motion-reduce:hover:scale-100">
										<Image
											src={other.icon}
											alt=""
											width={48}
											height={48}
											className="service-card-icon shrink-0"
										/>
										<span className="min-w-0 text-left">
											<span className="block capitalize text-lg font-semibold">{other.title}</span>
											<small className="block text-(--text-tertiary) text-sm mt-1">{other.text}</small>
										</span>
									</TransitionLink>
								</li>
							))}
						</ul>
					</nav>
				)}
			</article>
		</>
	);
};

export default ServiceDetailPage;
