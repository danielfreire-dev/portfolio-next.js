import { Service } from "@/types";
import { nanoid } from "nanoid";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Suspense } from "react";
import { WebsiteCardSkeleton } from "./Skeletons";

const Services = () => {
	const t = useTranslations("services");

	const collectionMap = (items: "websites" | "projects") => {
		return t
			.raw(`${items}`)
			.map((item: Dictionary["portfolio"]["websites" | "projects"][number]) => (
				<div
					className=" max-w-lg last:mr-0 mb-6 p-3 surface-cards"
					key={nanoid()}
				>
					<Suspense fallback={<WebsiteCardSkeleton />}>
						<div className="overflow-hidden shadow-md">
							<a href={item.link} target="_blank" rel="noopener noreferrer">
								<Image
									src={item.src}
									alt={item.title}
									width={1000}
									height={1000}
									className="hover:cursor-pointer transition-transform delay-150 duration-500 hover:scale-110 website-card-image"
								/>
							</a>
						</div>
					</Suspense>
					<div className="mt-4 box-border">
						<a
							href={item.link}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-block"
						>
							<h3 className="capitalize text-xl hover:underline font-semibold size-fit">
								{item.title}
							</h3>
						</a>
						<small className="block text-(--text-tertiary) text-sm break-words mt-1">
							{item.summary}
						</small>
					</div>
				</div>
			));
	};

	return (
		<div className="mx-15 text-center flex flex-wrap flex-col justify-center">
			<h2>{t("websites-title")}</h2>
			<section className="flex flex-row flex-wrap justify-center gap-x-7 websites-title">
				{collectionMap("websites")}
			</section>
			<h2>{t("projects-title")}</h2>
			<section className="flex flex-row flex-wrap justify-center gap-x-7 projects-title">
				{collectionMap("projects")}
			</section>
		</div>
	);
};
export default Services;
