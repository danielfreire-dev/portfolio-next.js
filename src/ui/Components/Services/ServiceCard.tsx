import Image from "next/image";
import { Suspense } from "react";

/** Props for a single service card. */
interface ServiceCardProps {
	/** Card title. */
	title: string;
	/** Descriptive text. */
	text: string;
	/** URL or path to the service icon image. */
	icon: string;
}

/**
 * Service card component.
 *
 * Renders an icon image, title, and description for a single service offering.
 * Uses a horizontal layout with a compact icon (matching TechCards sizing)
 * and the text content beside it.
 */
const ServiceCard = ({ title, text, icon }: ServiceCardProps) => {
	return (
		<div className="flex flex-row items-start gap-4 w-full max-w-lg p-4 surface-cards h-full">
			<Suspense fallback="Loading...">
				<div className="shrink-0  rounded-md">
					<Image
						src={icon}
						alt={title}
						width={64}
						height={64}
						className="service-card-icon hover:scale-110 transition-transform duration-300 ease-in-out"
					/>
				</div>
			</Suspense>
			<div className="min-w-0 overflow-hidden text-left">
				<h3 className="capitalize text-xl font-semibold break-words hyphens-auto">{title}</h3>
				<small className="block text-(--text-tertiary) text-sm mt-1 break-words hyphens-auto">{text}</small>
			</div>
		</div>
	);
};
export default ServiceCard;
