import { Dictionary } from "@/types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Suspense } from "react";
import { WebsiteCardSkeleton } from "./Skeletons";
import { LineMdCompassFilled } from "./svgs/LineMdCompassFilled";

/**
 * Portfolio cards section.
 *
 * Renders two collections ("websites" and "projects") from translation data.
 * Each item displays a screenshot, title, demo/github links, and a summary.
 */
const WebsiteCards = () => {
  const t = useTranslations("portfolio");

  /** Maps over a named collection and renders portfolio cards. */
  const collectionMap = (items: "websites" | "projects") => {
    return t
      .raw(`${items}`)
      .map(
        (
          item: Dictionary["portfolio"]["websites" | "projects"][number],
          index: number,
        ) => (
          <Suspense fallback={<WebsiteCardSkeleton />} key={item.title}>
            <div className=" max-w-lg last:mr-0 mb-6 p-3 surface-cards">
              <div className="overflow-hidden shadow-md">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <h3 className="capitalize text-xl mb-1 hover:underline font-semibold size-fit">
                    {item.title}
                  </h3>
                </a>

                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={1600}
                    height={900}
                    className="hover:cursor-pointer transition-transform delay-150 duration-500 hover:scale-110 website-card-image"
                    loading={`${index === 0 ? "eager" : "lazy"}`}
                  />
                </a>
              </div>

              <div className="mt-4 box-border">
                <div className="flex justify-center gap-1 mb-1">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${item.link ? "" : "hidden"} demo hover:underline`}
                  >
                    {item.demo}
                  </a>
                  <a
                    href={item.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${item.github ? "" : "hidden"} github hover:underline`}
                    // eslint-disable-next-line i18next/no-literal-string
                  >
                    GitHub
                  </a>
                </div>
                <small className="block text-(--text-tertiary) text-sm break-words mt-1">
                  {item.summary}
                </small>
              </div>
            </div>
          </Suspense>
        ),
      );
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

export default WebsiteCards;
