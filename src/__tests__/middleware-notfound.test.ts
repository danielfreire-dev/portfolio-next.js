import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";

// The i18n middleware itself is not under test here.
vi.mock("next-intl/middleware", () => ({
	default: () => () => new Response(null, { status: 200, headers: { "x-test": "intl" } }),
}));

const { default: middleware, isKnownLocalizedPath, NOT_FOUND_PATH } = await import("@/middleware");

const run = (path: string) => middleware(new NextRequest(new URL(path, "https://daniel-freire.com")));

describe("isKnownLocalizedPath", () => {
	it.each([
		["en", []],
		["en", ["about"]],
		["pt", ["sobre"]],
		["pt", ["about"]], // internal key: next-intl redirects it to /pt/sobre
		["de", ["dienstleistungen", "webentwicklung"]],
		["en", ["services", "web-development"]],
		["cs", ["ochrana-osobnich-udaju"]],
		["en", ["manifest.webmanifest"]],
	])("accepts /%s/%s", (locale, rest) => {
		expect(isKnownLocalizedPath(locale, rest)).toBe(true);
	});

	it.each([
		["en", ["nope"]],
		["en", ["prices"]], // route key without a page
		["de", ["sobre"]], // another locale's pathname
		["en", ["services", "not-a-service"]],
		["en", ["about", "extra"]],
		["en", ["services", "web-development", "extra"]],
		["en", NOT_FOUND_PATH.slice(1).split("/")],
	])("rejects /%s/%s", (locale, rest) => {
		expect(isKnownLocalizedPath(locale, rest)).toBe(false);
	});
});

describe("middleware 404 rewrite", () => {
	it("rewrites unknown localized URLs to the not-found page with a 404 status", () => {
		const res = run("/pt/nao-existe");
		expect(res.status).toBe(404);
		expect(res.headers.get("x-middleware-rewrite")).toBe(`https://daniel-freire.com/pt${NOT_FOUND_PATH}`);
	});

	it("passes known pages to the i18n middleware", () => {
		const res = run("/de/dienstleistungen/webentwicklung");
		expect(res.status).toBe(200);
		expect(res.headers.get("x-test")).toBe("intl");
	});

	it("still redirects mismatched service slugs before the 404 check", () => {
		const res = run("/en/services/skraeddersyet-forretningssoftware");
		expect(res.status).toBe(308);
		expect(res.headers.get("location")).toBe("https://daniel-freire.com/en/services/business-custom-software");
	});

	it("leaves paths without a locale to the i18n middleware (it adds the prefix)", () => {
		expect(run("/nope").headers.get("x-test")).toBe("intl");
	});
});
