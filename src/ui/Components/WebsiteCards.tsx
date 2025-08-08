import { Dictionary } from "@/types";
import { nanoid } from "nanoid";
import { useTranslations } from "next-intl";
import Image from "next/image";

const WebsiteCards = () => {
	const t = useTranslations("portfolio");

	const collectionMap = (items: "websites" | "projects") => {
		return t
			.raw(`${items}`)
			.map((item: Dictionary["portfolio"]["websites" | "projects"][number]) => (
				<div className="max-w-lg  mr-10 last:mr-0  mb-6 " key={nanoid()}>
					<div className="overflow-hidden rounded-lg shadow-md">
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
						<small className="block text-gray-600 text-sm break-words mt-1">
							{item.summary}
						</small>
					</div>
				</div>
			));
	};

	return (
		<div className="mx-15">
			<h2>{t("websites-title")}</h2>
			<section className="flex flex-row flex-wrap">
				{collectionMap("websites")}
			</section>
			<h2>{t("projects-title")}</h2>
			<section className="flex flex-row flex-wrap">
				{collectionMap("projects")}
			</section>
		</div>
	);
};

export default WebsiteCards;
