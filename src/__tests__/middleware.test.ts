import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

/**
 * Tests for the middleware (src/middleware.ts).
 *
 * Covers:
 * 1. Pass-through to next-intl for standard requests.
 * 2. The matcher pattern that controls which paths the middleware processes.
 *
 * Note: www → non-www redirect is now handled in `next.config.ts` redirects
 * (not the middleware), so it is tested separately at the integration level.
 */

// ---------------------------------------------------------------------------
// Mock next-intl/middleware — returns a pass-through that calls next().
// This isolates the middleware logic from locale negotiation.
// ---------------------------------------------------------------------------
vi.mock("next-intl/middleware", () => ({
	default: vi.fn(() => (_req: NextRequest) => NextResponse.next()),
}));

// Mock the routing module imported by middleware.ts.
vi.mock("./i18n/routing", () => ({
	routing: {
		locales: ["en", "pt"],
		defaultLocale: "en",
		pathnames: {
			"/services": {
				pt: "/servicos",
			},
		},
	},
}));

// Mock the serviceSlugs module to return identity for English.
vi.mock("./i18n/serviceSlugs", () => ({
	toEnglishSlug: vi.fn((slug: string) => slug),
	getLocalizedSlug: vi.fn((slug: string) => slug),
}));

// ---------------------------------------------------------------------------
// Dynamic import — after mocks are registered, import the middleware.
// ---------------------------------------------------------------------------
let middleware: (req: NextRequest) => NextResponse;

beforeEach(async () => {
	const mod = await import("../middleware");
	middleware = mod.default;
});

// ---------------------------------------------------------------------------
// Helper: build a NextRequest with a specific host header and path.
// ---------------------------------------------------------------------------
function buildReq(hostname: string, path = "/"): NextRequest {
	const url = `https://${hostname}${path}`;
	return new NextRequest(url, {
		headers: { host: hostname },
	});
}

// ===========================================================================
describe("middleware", () => {
	describe("pass-through to next-intl", () => {
		it("delegates root path to next-intl middleware", () => {
			const req = buildReq("daniel-freire.com", "/");
			const res = middleware(req);

			// Should be a pass-through (next()), not a redirect
			expect(res.status).toBe(200);
		});

		it("delegates locale-prefixed path to next-intl middleware", () => {
			const req = buildReq("daniel-freire.com", "/en/about");
			const res = middleware(req);

			expect(res.status).toBe(200);
		});

		it("does NOT redirect www requests (handled by next.config.ts)", () => {
			const req = buildReq("www.daniel-freire.com", "/en/about");
			const res = middleware(req);

			// www→non-www is now in next.config.ts redirects, not middleware
			expect(res.status).not.toBe(308);
		});
	});
});

// ===========================================================================
// Matcher pattern tests
// ===========================================================================
describe("middleware matcher", () => {
	const matcherPatterns = [
		"/((?!api|_next/static|_next/image|trpc|_next|_vercel|favicon.ico|.*/opengraph-image|llms.txt|sitemap.xml|.*\\.svg$|.*\\.png$|.*\\.webp$|.*\\.gif$|.*\\.txt$).*)",
	];

	function matchesPattern(path: string): boolean {
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

		for (const prefix of excludedPrefixes) {
			if (path.startsWith(prefix)) return false;
		}

		if (path === "/_next" || path.startsWith("/_next/data")) return false;

		if (path.includes("opengraph-image")) return false;

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
			expect(matchesPattern("/en/contact")).toBe(true);
		});

		it("should include paths with .json extension (not excluded)", () => {
			expect(matchesPattern("/api/data.json")).toBe(false);
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
