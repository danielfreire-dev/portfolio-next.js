import { Service } from "@/types";
import { nanoid } from "nanoid";
import Image from "next/image";
import { Suspense } from "react";

interface ServiceCardProps {
	title: string;
	text: string;
	icon: string;
}
const ServiceCard = ({ title, text, icon }: ServiceCardProps) => {
	return (
		<>
			<div
				className=" max-w-lg last:mr-0 mb-6 p-3 surface-cards"
				key={nanoid()}
			>
				<Suspense fallback="Loading...">
					<div className="overflow-hidden shadow-md">
						<Image
							src={icon}
							alt={title}
							width={1000}
							height={1000}
							className="hover:cursor-pointer transition-transform delay-150 duration-500 hover:scale-110 website-card-image"
						/>
					</div>
				</Suspense>
				<div className="mt-4 box-border">
					<h3 className="capitalize text-xl hover:underline font-semibold size-fit">
						{title}
					</h3>

					<small className="block text-(--text-tertiary) text-sm break-words mt-1">
						{text}
					</small>
				</div>
			</div>{" "}
		</>
	);
};
export default ServiceCard;
