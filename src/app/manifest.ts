import { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";

/**
 * Generates the Web App Manifest for Progressive Web App (PWA) support.
 *
 * Uses the English locale for the app name and configures the display mode,
 * theme color, and icon for the installed app.
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const locale = "en";
  const t = await getTranslations({ namespace: "metadata", locale });

  return {
    name: t("name"),
    start_url: "/",
    theme_color: "#ff7f00",
    display: "standalone",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
