import LocaleSwitcherSelect from "./LocaleSwitcherSelect";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
const LocaleSwitcher = () => {
	const t = useTranslations("localeSwitcher");
	const locale = useLocale();

	return (
		<LocaleSwitcherSelect defaultValue={locale}>
			{routing.locales.map((lang) => (
				<option key={lang} value={lang}>
					{t("locale", { locale: lang })}
				</option>
			))}
		</LocaleSwitcherSelect>
	);
};

export default LocaleSwitcher;
