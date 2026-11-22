import type { AbstractIntlMessages } from "next-intl";

/**
 * Message paths needed by Client Components rendered on **every** page
 * (sidenav, theme toggle, mobile menu button, cookie banner, CTA, error
 * boundary).
 *
 * Everything else is translated in Server Components, so it never needs to
 * reach the browser.  Shipping the whole messages file embedded ~40 KB of
 * JSON in every page's HTML.
 *
 * When a Client Component starts using a new key, add it here (global) or
 * to the page-level list below; otherwise it renders the raw key and
 * next-intl logs a MISSING_MESSAGE error.
 */
export const GLOBAL_CLIENT_MESSAGES = [
	"cookies",
	"cta",
	"error",
	"sidenav",
] as const;

/** Messages for the contact form (ContactForm + ContactFarewell). */
export const CONTACT_CLIENT_MESSAGES = ["contact"] as const;

/** Messages for the tech stack showcase on the About page. */
export const TECHSTACK_CLIENT_MESSAGES = ["home", "tech", "techCategories"] as const;

/**
 * Returns a subset of `messages` containing only the given paths.
 *
 * A path is a top-level namespace (`"cookies"`) or a dotted path to a nested
 * key (`"svgTitles.moonToSun"`).  Missing paths are skipped.
 *
 * @example
 * pickMessages(messages, ["cta", "svgTitles.moonToSun"]);
 * // → { cta: {...}, svgTitles: { moonToSun: "..." } }
 */
export function pickMessages(messages: AbstractIntlMessages, paths: readonly string[]): AbstractIntlMessages {
	const picked: AbstractIntlMessages = {};

	for (const path of paths) {
		const keys = path.split(".");
		let source: unknown = messages;
		for (const key of keys) {
			source = source && typeof source === "object" ? (source as Record<string, unknown>)[key] : undefined;
		}
		if (source === undefined) continue;

		let target = picked as Record<string, unknown>;
		keys.slice(0, -1).forEach((key) => {
			target[key] ??= {};
			target = target[key] as Record<string, unknown>;
		});
		target[keys[keys.length - 1]] = source;
	}

	return picked;
}
