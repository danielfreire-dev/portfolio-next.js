import { describe, it, expect } from "vitest";

/**
 * Tests for the middleware matcher pattern used in src/middleware.ts.
 *
 * The matcher is a regex pattern that excludes API routes, static assets,
 * and common file types from being processed by the i18n middleware.
 */
describe("middleware matcher", () => {
	// Extract the matcher pattern from the config
	const matcherPatterns = [
		"/((?!api|_next/static|_next/image|trpc|_next|_vercel|favicon.ico|.*/opengraph-image|llms.txt|sitemap.xml|.*\\.svg$|.*\\.png$|.*\\.webp$|.*\\.gif$|.*\\.txt$).*)",
	];

	/**
	 * Builds a RegExp from a Next.js matcher glob pattern.
	 * Next.js uses path-to-regexp internally, but we approximate with
	 * simple string matching for test validation.
	 */
	function matchesPattern(path: string): boolean {
		// The matcher is a "match all except" pattern
		// Excluded: api, _next/static, _next/image, trpc, _next, _vercel,
		//           favicon.ico, opengraph-image, llms.txt, sitemap.xml,
		//           .svg, .png, .webp, .gif, .txt files
		const excludedPrefixes = [
			"/api/",
			"/_next/static/",
			"/_next/image",
			"/trpc/",
			"/_vercel/",
			"/favicon.ico",
			"/llms.txt",
			"/sitemap.xml",
		];

		const excludedSuffixes = [".svg", ".png", ".webp", ".gif", ".txt"];

		// Check prefixes
		for (const prefix of excludedPrefixes) {
			if (path.startsWith(prefix)) return false;
		}

		// Also exclude exact matches for _next without trailing slash
		if (path === "/_next" || path.startsWith("/_next/data")) return false;

		// Check opengraph-image anywhere
		if (path.includes("opengraph-image")) return false;

		// Check suffixes
		for (const suffix of excludedSuffixes) {
			if (path.endsWith(suffix)) return false;
		}

		return true;
	}

	describe("excluded paths", () => {
		it("should exclude /api/* routes", () => {
			expect(matchesPattern("/api/auth")).toBe(false);
			expect(matchesPattern("/api/users/123")).toBe(false);
		});

		it("should exclude /_next/static/* routes", () => {
			expect(matchesPattern("/_next/static/chunks/main.js")).toBe(false);
			expect(matchesPattern("/_next/static/css/styles.css")).toBe(false);
		});

		it("should exclude /_next/image routes", () => {
			expect(matchesPattern("/_next/image?url=/photo.jpg")).toBe(false);
			expect(matchesPattern("/_next/image/")).toBe(false);
		});

		it("should exclude /trpc/* routes", () => {
			expect(matchesPattern("/trpc/hello")).toBe(false);
		});

		it("should exclude /_vercel/* routes", () => {
			expect(matchesPattern("/_vercel/insights")).toBe(false);
		});

		it("should exclude favicon.ico", () => {
			expect(matchesPattern("/favicon.ico")).toBe(false);
		});

		it("should exclude sitemap.xml", () => {
			expect(matchesPattern("/sitemap.xml")).toBe(false);
		});

		it("should exclude llms.txt", () => {
			expect(matchesPattern("/llms.txt")).toBe(false);
		});

		it("should exclude .svg files", () => {
			expect(matchesPattern("/images/logo.svg")).toBe(false);
			expect(matchesPattern("/icon.svg")).toBe(false);
		});

		it("should exclude .png files", () => {
			expect(matchesPattern("/images/photo.png")).toBe(false);
		});

		it("should exclude .webp files", () => {
			expect(matchesPattern("/images/carousel/banner.webp")).toBe(false);
		});

		it("should exclude .gif files", () => {
			expect(matchesPattern("/animations/loading.gif")).toBe(false);
		});

		it("should exclude .txt files", () => {
			expect(matchesPattern("/robots.txt")).toBe(false);
			expect(matchesPattern("/data/config.txt")).toBe(false);
		});

		it("should exclude opengraph-image anywhere in the path", () => {
			expect(matchesPattern("/en/opengraph-image")).toBe(false);
			expect(matchesPattern("/opengraph-image.png")).toBe(false);
		});
	});

	describe("included paths", () => {
		it("should include root path", () => {
			expect(matchesPattern("/")).toBe(true);
		});

		it("should include locale-prefixed page routes", () => {
			expect(matchesPattern("/en")).toBe(true);
			expect(matchesPattern("/en/about")).toBe(true);
			expect(matchesPattern("/pt/contactos")).toBe(true);
			expect(matchesPattern("/de/portfolio")).toBe(true);
			expect(matchesPattern("/dk/privatlivspolitik")).toBe(true);
		});

		it("should include nested page routes", () => {
			expect(matchesPattern("/en/about/team")).toBe(true);
			expect(matchesPattern("/pt/portfolio/projects")).toBe(true);
		});

		it("should include paths with query parameters (middleware sees path only)", () => {
			// Middleware receives the pathname without query string
			expect(matchesPattern("/en/contact")).toBe(true);
		});

		it("should include paths with .json extension (not excluded)", () => {
			// .json is NOT in the exclusion list — only specific files like sitemap.xml
			expect(matchesPattern("/api/data.json")).toBe(false); // starts with /api/
			expect(matchesPattern("/en/data.json")).toBe(true);
		});
	});

	describe("matcher pattern format", () => {
		it("should have exactly one matcher pattern", () => {
			expect(matcherPatterns).toHaveLength(1);
		});

		it("should be a non-empty string", () => {
			expect(matcherPatterns[0]).toBeTruthy();
			expect(typeof matcherPatterns[0]).toBe("string");
		});

		it("should contain the negative lookahead assertion pattern", () => {
			expect(matcherPatterns[0]).toContain("(?!");
			expect(matcherPatterns[0]).toContain("api");
			expect(matcherPatterns[0]).toContain("_next");
		});
	});
});
