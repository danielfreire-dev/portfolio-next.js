import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import en from "@/messages/en.json";
import type { AbstractIntlMessages } from "next-intl";
import { GLOBAL_CLIENT_MESSAGES, pickMessages } from "@/i18n/clientMessages";

describe("pickMessages", () => {
	const messages = { a: { x: "1", y: "2" }, b: "3", c: { d: { e: "4" } } };

	it("picks whole namespaces and nested paths", () => {
		expect(pickMessages(messages, ["b", "a.y", "c.d.e"])).toEqual({ b: "3", a: { y: "2" }, c: { d: { e: "4" } } });
	});

	it("skips paths that do not exist", () => {
		expect(pickMessages(messages, ["missing", "a.missing"])).toEqual({});
	});
});

/**
 * Client Components rendered on every page (via the layout).  Their
 * translations must be covered by GLOBAL_CLIENT_MESSAGES, otherwise they
 * render raw keys in production.
 */
const GLOBAL_CLIENT_FILES = [
	"src/app/[locale]/error.tsx",
	"src/providers/CookieBanner.tsx",
	"src/ui/Components/CtA/Cta.tsx",
	"src/ui/Components/ThemeToggle.tsx",
	"src/ui/Components/Sidenav/Sidenav.tsx",
	"src/ui/Components/Sidenav/NavigationList.tsx",
	"src/ui/Components/Sidenav/LegalLinks.tsx",
	"src/ui/Components/Sidenav/CustomSelect.tsx",
	"src/ui/Components/Sidenav/MobileSlideBtn.tsx",
];

describe("GLOBAL_CLIENT_MESSAGES", () => {
	const picked = pickMessages(en as unknown as AbstractIntlMessages, GLOBAL_CLIENT_MESSAGES) as Record<string, Record<string, unknown>>;

	for (const file of GLOBAL_CLIENT_FILES) {
		it(`covers every key used by ${path.basename(file)}`, () => {
			const source = fs.readFileSync(path.resolve(file), "utf8");
			// Map each translator variable to its namespace: const t = useTranslations("ns")
			const translators = [...source.matchAll(/const (\w+) = useTranslations\("([^"]+)"\)/g)];
			expect(translators.length).toBeGreaterThan(0);

			for (const [, variable, namespace] of translators) {
				expect(picked[namespace], `namespace "${namespace}" is not shipped to the client`).toBeDefined();
				const keys = [...source.matchAll(new RegExp(`\\b${variable}(?:\\.raw)?\\("([^"]+)"`, "g"))].map((m) => m[1]);
				for (const key of keys) {
					const value = key.split(".").reduce<unknown>((acc, k) => (acc as Record<string, unknown>)?.[k], picked[namespace]);
					expect(value, `"${namespace}.${key}" is not shipped to the client`).toBeDefined();
				}
			}
		});
	}
});
