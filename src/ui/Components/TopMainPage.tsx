import { useTranslations } from "next-intl";
import { DjangoRocket } from "./svgs/django-rocket";
import DjangoRocketSwitcher from "./DjangoRocketSwitcher";
interface topMainPage {
  title: string;
  description: string;
}

const TopMainPage = () => {
  const t = useTranslations("topMainPage");

  /* md:bg-radial-[at_84%_50%] from-(--primary)/20 via-(--accent1)/5 to-transparent to-66%" */
  return (
    <div className="grid grid-cols-2 justify-items-center-safe content-evenly gap-3 xl:gap-7 l h-[90dvh]">
      <div className="grid place-items-center h-full items-center-safe px-10 text-center lg:px-0 focus-in-expand mb-30">
        <h2 className="">{t("p1")}</h2>
        <div className="text mt-2">{t("p2")}</div>
      </div>

      <DjangoRocket />
      {/* <DjangoRocketSwitcher /> */}
    </div>
  );
};
export default TopMainPage;
