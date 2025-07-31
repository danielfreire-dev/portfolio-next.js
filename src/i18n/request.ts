import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
	try {
		// Typically corresponds to the `[locale]` segment
		const requested = await requestLocale;
		const locale = hasLocale(routing.locales, requested)
			? requested
			: routing.defaultLocale;

		// Import messages with a fallback mechanism
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
		// Fallback to default locale and messages
		return {
			locale: routing.defaultLocale,
			messages: (await import(`@/messages/${routing.defaultLocale}.json`))
				.default,
		};
	}
});
