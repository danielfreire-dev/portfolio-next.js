import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/**
 * next-intl request configuration.
 *
 * Resolves the active locale from the request, validates it against the
 * supported locales list, and loads the corresponding translation messages.
 * Falls back to the default locale if the requested locale is unsupported or
 * if message loading fails. Wraps the entire resolution in a try/catch to
 * guarantee a working fallback even when catastrophic failures occur (e.g.,
 * missing message files during a deployment cutover).
 *
 * @todo Consider adding structured logging (e.g., Pino) for locale-resolution
 *       failures so they surface in monitoring dashboards.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  try {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale;

    let messages;
    try {
      messages = (await import(`@/messages/${locale}.json`)).default;
    } catch (error) {
      console.error(`Failed to import messages for locale ${locale}:`, error);
      messages = (await import(`@/messages/${routing.defaultLocale}.json`))
        .default;
    }

    return {
      locale,
      messages,
    };
  } catch (error) {
    console.error("Error in getRequestConfig:", error);
    return {
      locale: routing.defaultLocale,
      messages: (await import(`@/messages/${routing.defaultLocale}.json`))
        .default,
    };
  }
});
