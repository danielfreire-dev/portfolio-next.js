import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import ServiceCard from "./ServiceCard";
import { TransitionLink } from "@/ui/Components/Sidenav/TransitionLink";

/** Props for the {@link Services} section. */
interface ServicesProps {
	/**
	 * Heading element for the section title.  Use `"h1"` when the section is
	 * the main content of the page (the services listing), `"h2"` when it is
	 * one section among others (the home page).
	 */
	headingLevel?: "h1" | "h2";
	/** Optional content rendered between the heading and the cards (e.g. an intro). */
	children?: ReactNode;
}

/**
 * Services section — responsive grid of service offering cards,
 * each linking to its detail page.
 *
 * Reads the `services` array from i18n translations and maps each item
 * to a {@link ServiceCard} wrapped in a {@link TransitionLink}.  Links use the
 * typed `/services/[service]` route so next-intl emits the localized path
 * (e.g. `/pt/servicos/...`) instead of a redirecting `/pt/services/...`.
 */
const Services = ({ headingLevel: Heading = "h2", children }: ServicesProps) => {
	const t = useTranslations();
	const services = t.raw("services") as Array<{
		slug: string;
		icon: string;
		title: string;
		text: string;
	}>;

	return (
		<>
			<Heading className="text-3xl font-bold text-center">{t("metadata.title.services")}</Heading>

			{children}

			<section className="m-4 sm:mx-15 mb-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch justify-items-center">
					{services.map((service) => (
						<TransitionLink
							key={service.slug}
							href={{ pathname: "/services/[service]", params: { service: service.slug } }}
							className="block w-full max-w-lg h-full hover:scale-[1.02] transition-transform duration-300 ease-in-out">
							<ServiceCard
								icon={service.icon}
								title={service.title}
								text={service.text}
							/>
						</TransitionLink>
					))}
				</div>
			</section>
		</>
	);
};

export default Services;
