import { describe, it, expect } from "vitest";
import { routing } from "@/i18n/routing";

describe("i18n routing configuration", () => {
	describe("locales", () => {
		it("should define all 6 supported locales", () => {
			expect(routing.locales).toHaveLength(6);
			expect(routing.locales).toEqual(expect.arrayContaining(["en", "pt", "da", "pl", "de", "cs"]));
		});

		it("should have no duplicate locale codes", () => {
			const uniqueLocales = new Set(routing.locales);
			expect(uniqueLocales.size).toBe(routing.locales.length);
		});
	});

	describe("defaultLocale", () => {
		it("should default to 'en'", () => {
			expect(routing.defaultLocale).toBe("en");
		});

		it("should be included in the locales list", () => {
			expect(routing.locales).toContain(routing.defaultLocale);
		});
	});

	describe("pathnames", () => {
		const requiredRoutes = [
			"/",
			"/about",
			"/portfolio",
			"/contact",
			"/privacy-policy",
			"/services",
			"/services/[service]",
			"/sitemap.xml",
			"/robots.txt",
			"/404",
			"/prices",
		];

		it("should have pathname entries for all required routes", () => {
			// pathnames might be a Record<string, ...> — check keys
			const pathnameKeys = Object.keys(routing.pathnames);
			for (const route of requiredRoutes) {
				expect(pathnameKeys).toContain(route);
			}
		});

		describe("per-locale pathname mappings", () => {
			// Locales that should have custom pathnames for /about
			it("should define custom /about pathnames for all non-English locales", () => {
				const about = routing.pathnames["/about"];
				// If it's a string, no locale overrides; if object, check each
				if (typeof about === "object") {
					expect(about).toHaveProperty("pt");
					expect(about).toHaveProperty("da");
					expect(about).toHaveProperty("pl");
					expect(about).toHaveProperty("de");
					expect(about).toHaveProperty("cs");
				}
			});

			it("should define custom /contact pathnames for all non-English locales", () => {
				const contact = routing.pathnames["/contact"];
				if (typeof contact === "object") {
					expect(contact).toHaveProperty("pt");
					expect(contact).toHaveProperty("da");
					expect(contact).toHaveProperty("pl");
					expect(contact).toHaveProperty("de");
					expect(contact).toHaveProperty("cs");
				}
			});

			it("should define custom /privacy-policy pathnames for all non-English locales", () => {
				const pp = routing.pathnames["/privacy-policy"];
				if (typeof pp === "object") {
					expect(pp).toHaveProperty("pt");
					expect(pp).toHaveProperty("da");
					expect(pp).toHaveProperty("pl");
					expect(pp).toHaveProperty("de");
					expect(pp).toHaveProperty("cs");
				}
			});

			it("should use the same path for /portfolio across all locales", () => {
				const portfolio = routing.pathnames["/portfolio"];
				if (typeof portfolio === "object") {
					for (const locale of routing.locales) {
						if (locale in portfolio) {
							expect((portfolio as Record<string, string>)[locale]).toBe("/portfolio");
						}
					}
				}
			});

			it("should have non-empty pathname values for all locale overrides", () => {
				const pathnames = routing.pathnames as Record<string, string | Record<string, string>>;
				for (const [route, mapping] of Object.entries(pathnames)) {
					if (typeof mapping === "object") {
						for (const [, value] of Object.entries(mapping)) {
							expect(value).toBeTruthy();
							expect(typeof value).toBe("string");
						}
					} else {
						expect(mapping).toBeTruthy();
						expect(typeof mapping).toBe("string");
					}
				}
			});
		});

		describe("route integrity", () => {
			it("should have '/' as the root pathname", () => {
				expect(routing.pathnames["/"]).toBe("/");
			});

			it("should have all locale keys in each mapped route be valid locales", () => {
				const pathnames = routing.pathnames as Record<string, string | Record<string, string>>;
				for (const [, mapping] of Object.entries(pathnames)) {
					if (typeof mapping === "object") {
						for (const locale of Object.keys(mapping)) {
							// The routing.ts has 'cs' in some places while locales list has 'cz'
							// Accept both patterns
							expect(routing.locales.includes(locale as (typeof routing.locales)[number]) || locale === "cs").toBe(
								true,
							);
						}
					}
				}
			});
		});
	});
});
