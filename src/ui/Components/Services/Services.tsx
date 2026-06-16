import { useTranslations } from "next-intl";
import ServiceCard from "./ServiceCard";

/**
 * Services section — 2×2 grid of service offerings.
 *
 * Reads the `services` array from i18n translations and maps each item
 * to a {@link ServiceCard} inside a responsive CSS grid.
 */
const Services = () => {
	const t = useTranslations();
	const services = t.raw("services") as Array<{
		icon: string;
		title: string;
		text: string;
	}>;

	return (
		<section className="mx-15">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center">
				{services.map((service) => (
					<ServiceCard
						key={service.title}
						icon={service.icon}
						title={service.title}
						text={service.text}
					/>
				))}
			</div>
		</section>
	);
};
export default Services;
