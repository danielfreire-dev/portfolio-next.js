import { useTranslations } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import { Locale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { TransitionLink } from "@/ui/Components/Sidenav/TransitionLink";
import { generateBreadcrumbSchema, generateServiceSchema } from "@/ui/Components/StructuredData";
import { getAllLocalizedSlugs, getLocalizedSlug, toEnglishSlug } from "@/i18n/serviceSlugs";
import { getAlternates } from "@/i18n/alternates";

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
 * Localized heading for the features/included section on service detail pages.
 *
 * Provides a hardcoded fallback for the "What's Included" heading in every
 * supported locale, ensuring the features section label is always visible even
 * when the main translation files haven't been updated for a new locale.
 */
const FEATURES_HEADING: Record<string, string> = {
	en: "What's Included",
	pt: "O Que Está Incluído",
	da: "Hvad Er Inkluderet",
	pl: "Co Zawiera",
	de: "Was Enthalten Ist",
	cs: "Co Je Zahrnuto",
};

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

	const metaT = await getTranslations({ locale, namespace: "metadata" });

	const alternates = getAlternates({
		href: { pathname: "/services/[service]", params: { service: slug } },
		locale,
		hrefForLocale: (cur) => ({
			pathname: "/services/[service]",
			params: { service: getLocalizedSlug(englishSlug, cur) },
		}),
	});

	return {
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
		robots: { index: true, follow: true },
		alternates,
		openGraph: {
			type: "website",
			title: `${service.title} | ${metaT("name")}`,
			description: service.text,
			url: `https://daniel-freire.com${alternates.canonical}`,
			siteName: `${service.title} | Daniel Freire`,
			images: [{ url: "https://daniel-freire.com/metadata/open-graph-initials5.png", width: 1200, height: 630 }],
			locale: locale,
		},
		twitter: {
			card: "summary_large_image",
			title: `${service.title} | ${metaT("name")}`,
			description: service.text,
			images: ["https://daniel-freire.com/metadata/open-graph-initials5.png"],
		},
	};
}

/**
 * Service detail page — elaborates on a single service offering.
 *
 * Displays a hero section with the service icon and title, the full
 * long-form description, a feature/benefit bullet list, a CTA button,
 * and a back-link to the services listing.
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

	const descriptionParagraphs = service.longDescription.split("\n\n").filter(Boolean);

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(
						generateBreadcrumbSchema([
							{ name: "Home", href: `/${locale}` },
							{ name: "Services", href: `/${locale}/services` },
							{ name: service.title, href: `/${locale}/services/${slug}` },
						]),
					),
				}}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(generateServiceSchema(service.title, service.text, service.features, slug)),
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
					<h2 className="text-3xl sm:text-4xl font-bold capitalize text-center sm:text-left">{service.title}</h2>
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
						<h3 className="text-xl font-semibold mb-4">
							{FEATURES_HEADING[locale as keyof typeof FEATURES_HEADING] ?? FEATURES_HEADING.en}
						</h3>
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

				{/* CTA */}
				<div className="text-center mb-10" />
			</article>
		</>
	);
};

export default ServiceDetailPage;
