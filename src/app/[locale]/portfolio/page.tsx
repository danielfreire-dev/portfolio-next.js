import { Locale, useTranslations } from "next-intl";
import Cta from "../../../ui/Components/CtA/Cta";
import WebsiteCards from "../../../ui/Components/WebsiteCards";
import { getTranslations } from "next-intl/server";
import { Metadata, ResolvingMetadata } from "next";

interface Props {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Generates localized metadata for the portfolio page.
 *
 * Fetches translated title, description, and Open Graph data based on the
 * resolved locale from the route params.
 */
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  // Await the params Promise to get the actual locale value
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale,
    namespace: "metadata",
  });

  return {
    title: t("title.portfolio"),
    description: t("description.portfolio"),
    alternates: {
      canonical: "/portfolio",
      languages: {
        en: "https://daniel-freire.com/en/portfolio",
        pt: "https://daniel-freire.com/pt/portfolio",
      },
    },
    openGraph: {
      title: t("opengraphImageAlt"),
      description: t("description.portfolio"),
      url: "https://daniel-freire.com",
      siteName: `${t("title.portfolio")} | Daniel Freire`,
      images: [
        { url: `https://daniel-freire.com/metadata/open-graph-initials5.png` },
      ],
      locale: locale,
      type: "website",
    },
  };
}

/**
 * Portfolio page — displays project and website cards with a CTA.
 *
 * Route: /[locale]/portfolio
 */
const Portfolio = () => {
  const t = useTranslations("portfolio");

  return (
    <>
      <h2 className="text-2xl font-bold mx-auto text-center capitalize mb-4">
        {t("pageTitle")}!
      </h2>

      <WebsiteCards />

      <Cta />
    </>
  );
};

export default Portfolio;
