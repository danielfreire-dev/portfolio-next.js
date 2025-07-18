export const i18n = {
	defaultLocale: "english",
	locales: ["english", "portuguese"],
} as const;

export type Locale = (typeof i18n)["locales"][number];
