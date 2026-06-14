import { useTranslations } from "next-intl";
import { DjangoRocket } from "./svgs/django-rocket";

/** Props for the top/main hero section (unused — translations drive content). */
interface topMainPage {
  title: string;
  description: string;
}

/**
 * Hero section for the home page.
 *
 * Displays a two-column layout with translated heading/subtitle text and a
 * Django Rocket SVG illustration.
 */
const TopMainPage = () => {
  const t = useTranslations("topMainPage");

  return (
    <div className="grid md:grid-cols-2 justify-items-center-safe content-evenly gap-3 xl:gap-7 l h-[90dvh]">
      <div className="grid place-items-center h-full items-center-safe px-10 text-center lg:px-0 focus-in-expand mb-30">
        <h2 className="">{t("p1")}</h2>
        <div className="text mt-2">{t("p2")}</div>
      </div>

      <DjangoRocket />
    </div>
  );
};
export default TopMainPage;
