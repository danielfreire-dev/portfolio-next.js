import { useTranslations } from "next-intl";
import ServiceCard from "./ServiceCard";
import { TransitionLink } from "@/ui/Components/Sidenav/TransitionLink";

/**
 * Services section — responsive grid of service offering cards,
 * each linking to its detail page.
 *
 * Reads the `services` array from i18n translations and maps each item
 * to a {@link ServiceCard} wrapped in a {@link TransitionLink}.
 */
const Services = () => {
	const t = useTranslations();
	const services = t.raw("services") as Array<{
		slug: string;
		icon: string;
		title: string;
		text: string;
	}>;

	return (
		<>
			<h2 className="mt-7 text-3xl font-bold text-center">{t("metadata.title.services")}</h2>

			<section className="m-4 sm:mx-15 mb-6">
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
		</>
	);
};

export default Services;
