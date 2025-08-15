import Image from "next/image";
import Cta from "./CtA/Cta";
import { Suspense } from "react";

import { useTranslations } from "next-intl";

const ClientSideAbout = () => {
	const t = useTranslations("about");

	return (
		<>
			<div className="px-20 lg:grid lg:grid-cols-2 gap-6">
				<Image
					src={t("image")}
					alt="drawing of Daniel"
					width={1000}
					height={1000}
					className="hidden lg:block mt-10"
				/>
				<div className="text-justify">
					<h2 className="pt-5">{t("title1")}</h2>
					<h3 className="pt-4">{t("title2")}</h3>
					<p>{t("paragraph1")}</p>
					<p>{t("paragraph2")}</p>
					<h3 className="pt-4">{t("title3")}</h3>
					<p>{t("paragraph3")}</p>
					<p>{t("paragraph4")}</p>
					<h3 className="pt-4">{t("title4")}</h3>
					<p>{t("paragraph5")}</p>
					<p>{t("paragraph6")}</p>
					<h3 className="pt-4">{t("title5")}</h3>
					<p>{t("paragraph7")}</p>
				</div>
			</div>
			<Suspense fallback={<div>Loading...</div>}>
				<Cta />
			</Suspense>
		</>
	);
};

export default ClientSideAbout;
