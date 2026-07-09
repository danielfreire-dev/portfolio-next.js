import Image from "next/image";
import Cta from "./CtA/Cta";
import { Suspense } from "react";

import { useTranslations } from "next-intl";

/**
 * About-page client component.
 *
 * Renders a profile image alongside translated biographical paragraphs and a
 * call-to-action button. Content is driven entirely by i18n translation keys,
 * allowing the same component to serve all supported locales without code
 * duplication.
 *
 * @todo Internationalize the profile image `alt` attribute so screen-reader
 *       users in non-English locales receive a translated description.
 */
const ClientSideAbout = () => {
	const t = useTranslations("about");

	return (
		<>
			<div className="px-20 lg:grid lg:grid-cols-2 gap-6 focus-in-expand">
				<Image
					src={t("image")}
					alt="oil painting of Daniel"
					width={900}
					height={900}
					className="hidden lg:block mt-4"
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
