import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/**
 * next-intl request configuration.
 *
 * Resolves the active locale from the request, validates it against the
 * supported locales list, and loads the corresponding translation messages.
 * Falls back to the default locale if the requested locale is unsupported or
 * if message loading fails.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  try {
    // Resolve the locale from the `[locale]` URL segment
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale;

    // Load translation messages with a fallback to the default locale
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
    // Ultimate fallback: return default locale and messages
    return {
      locale: routing.defaultLocale,
      messages: (await import(`@/messages/${routing.defaultLocale}.json`))
        .default,
    };
  }
});
