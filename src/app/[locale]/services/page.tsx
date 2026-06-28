import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { use } from "react";
import { Locale } from "next-intl";
import ServiceCard from "@/ui/Components/Services/ServiceCard";
import Cta from "@/ui/Components/CtA/Cta";
import { TransitionLink } from "@/ui/Components/Sidenav/TransitionLink";

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

	return {
		title: t("title.services"),
		description: t("description.services"),
		alternates: {
			canonical: "/services",
			languages: {
				en: "https://daniel-freire.com/en/services",
				pt: "https://daniel-freire.com/pt/servicos",
			},
		},
		openGraph: {
			title: t("opengraphImageAlt"),
			description: t("description.services"),
			url: "https://daniel-freire.com",
			siteName: `${t("title.services")} | Daniel Freire`,
			images: [{ url: "https://daniel-freire.com/metadata/open-graph-initials5.png" }],
			locale: locale,
			type: "website",
		},
	};
}

/**
 * Services listing page — displays all service offerings as cards
 * in a responsive grid, each linking to its detail page.
 *
 * Route: /[locale]/services
 */
const ServicesPage = ({ params }: Props) => {
	const { locale } = use(params);
	setRequestLocale(locale);

	const t = useTranslations();
	const services = t.raw("services") as Array<{
		slug: string;
		icon: string;
		title: string;
		text: string;
	}>;

	return (
		<>
			<h2 className="text-2xl font-bold mx-auto text-center capitalize mb-8">{t("metadata.title.services")}</h2>

			<section className="mx-4 sm:mx-15 mb-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center">
					{services.map((service) => (
						<TransitionLink
							key={service.slug}
							href={`/services/${service.slug}` as any}
							className="block w-full max-w-lg hover:scale-[1.02] transition-transform duration-300 ease-in-out">
							<ServiceCard
								icon={service.icon}
								title={service.title}
								text={service.text}
							/>
						</TransitionLink>
					))}
				</div>
			</section>

			<Cta />
		</>
	);
};

export default ServicesPage;
