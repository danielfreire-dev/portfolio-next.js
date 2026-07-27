import LocaleSwitcherSelectMobile from "./LocaleSwitcherSelectMobile";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

/**
 * LocaleSwitcherMobile - Mobile language selector component.
 *
 * Wraps `LocaleSwitcherSelectMobile` with the list of available locales from
 * the routing configuration, providing translated option labels.
 */
const LocaleSwitcherMobile = () => {
  const t = useTranslations("localeSwitcher");
  const locale = useLocale();

  return (
    <LocaleSwitcherSelectMobile defaultValue={locale}>
      {routing.locales.map((lang) => (
        <option key={lang} value={lang} className="bg-(--background)">
          {t("localeMobile", { locale: lang })}
        </option>
      ))}
    </LocaleSwitcherSelectMobile>
  );
};

export default LocaleSwitcherMobile;
