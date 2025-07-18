import type { Locale } from "./i18n-config";

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
	english: () =>
		import("@/app/i18n/dictionaries/en-US.json").then(
			(module) => module.default,
		),
	portuguese: () =>
		import("@/app/i18n/dictionaries/pt-PT.json").then(
			(module) => module.default,
		),
};

export const getDictionary = async (locale: Locale) =>
	dictionaries[locale]?.() ?? dictionaries.english();
