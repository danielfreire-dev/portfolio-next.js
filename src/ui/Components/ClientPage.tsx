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
					width={900}
					height={900}
					className="hidden lg:block mt-4 transition duration-900 ease-in"
				/>
				<div className="text-justify">
					<h2 className="">{t("title1")}</h2>

					<p className="mb-2">{t("paragraph1")}</p>
					<p className="mb-2">{t("paragraph2")}</p>

					<p className="mb-2">{t("paragraph3")}</p>
					<p className="mb-2">{t("paragraph4")}</p>

					<p className="mb-2">{t("paragraph5")}</p>
					<p className="mb-2">{t("paragraph6")}</p>

					<p className="mb-2">{t("paragraph7")}</p>
				</div>
			</div>
			<Suspense fallback={<div>Loading...</div>}>
				<Cta />
			</Suspense>
		</>
	);
};

export default ClientSideAbout;
