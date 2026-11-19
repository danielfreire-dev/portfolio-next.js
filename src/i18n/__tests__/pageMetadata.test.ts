import { describe, it, expect } from "vitest";
import { buildPageMetadata, OG_LOCALES } from "@/i18n/pageMetadata";
import { getCanonicalUrl } from "@/i18n/alternates";
import sitemap from "@/app/sitemap";

describe("getCanonicalUrl", () => {
	it("resolves localized pathnames to absolute URLs", () => {
		expect(getCanonicalUrl("/about", "pt")).toBe("https://daniel-freire.com/pt/sobre");
		expect(getCanonicalUrl("/", "de")).toBe("https://daniel-freire.com/de");
		expect(
			getCanonicalUrl({ pathname: "/services/[service]", params: { service: "desenvolvimento-web" } }, "pt"),
		).toBe("https://daniel-freire.com/pt/servicos/desenvolvimento-web");
	});
});

describe("buildPageMetadata", () => {
	const meta = buildPageMetadata({ href: "/about", locale: "pt", title: "Sobre", description: "Descrição" });

	it("uses the localized canonical URL for og:url", () => {
		expect(meta.alternates?.canonical).toBe("https://daniel-freire.com/pt/sobre");
		expect(meta.openGraph?.url).toBe("https://daniel-freire.com/pt/sobre");
	});

	it("emits og:locale in language_TERRITORY format with the other locales as alternates", () => {
		expect(meta.openGraph?.locale).toBe("pt_PT");
		expect(meta.openGraph?.alternateLocale).toEqual(Object.values(OG_LOCALES).filter((l) => l !== "pt_PT"));
	});

	it("does not reference any social media handle", () => {
		expect(meta.twitter).toBeUndefined();
	});

	it("lets the layout template add the site name, and uses the full title for og:title", () => {
		expect(meta.title).toBe("Sobre");
		expect(meta.openGraph?.title).toBe("Sobre | Daniel Freire");
	});

	it("supports absolute titles that already contain the name", () => {
		const home = buildPageMetadata({
			href: "/",
			locale: "en",
			title: "Daniel Freire | Web Developer",
			absoluteTitle: true,
			description: "x",
		});
		expect(home.title).toEqual({ absolute: "Daniel Freire | Web Developer" });
		expect(home.openGraph?.title).toBe("Daniel Freire | Web Developer");
	});

	it("respects the index flag", () => {
		expect(meta.robots).toEqual({ index: true, follow: true });
		const noindex = buildPageMetadata({ href: "/privacy-policy", locale: "en", title: "x", description: "y", index: false });
		expect(noindex.robots).toEqual({ index: false, follow: true });
	});
});

describe("sitemap", () => {
	const entries = sitemap();

	it("only lists indexable pages (no privacy policy)", () => {
		expect(entries.some((e) => /privacy|privacidade|privatliv|prywatnosci|datenschutz|ochrana/.test(e.url))).toBe(false);
	});

	it("uses fixed lastModified dates rather than the build time", () => {
		const today = new Date().toISOString().slice(0, 10);
		const buildTimeLike = entries.filter((e) => String(e.lastModified).slice(11) !== "00:00:00.000Z");
		expect(buildTimeLike).toHaveLength(0);
		expect(entries.every((e) => String(e.lastModified) <= `${today}T23:59:59.999Z`)).toBe(true);
	});

	it("lists 5 static pages and 4 services for each of the 6 locales", () => {
		expect(entries).toHaveLength(6 * (5 + 4));
	});
});
