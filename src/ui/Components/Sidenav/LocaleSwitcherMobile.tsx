import LocaleSwitcherSelectMobile from "./LocaleSwitcherSelectMobile";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

const LocaleSwitcherMobile = () => {
	const t = useTranslations("localeSwitcher");
	const locale = useLocale();

	return (
		<LocaleSwitcherSelectMobile defaultValue={locale}>
			{routing.locales.map((lang) => (
				<option key={lang} value={lang} className="dark:bg-black">
					{t("localeMobile", { locale: lang })}
				</option>
			))}
		</LocaleSwitcherSelectMobile>
	);
};

export default LocaleSwitcherMobile;
