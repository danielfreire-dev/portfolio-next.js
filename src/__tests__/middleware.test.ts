import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

/**
 * Tests for the middleware (src/middleware.ts).
 *
 * Covers two responsibilities:
 * 1. The www → non-www redirect (hostname-based).
 * 2. The matcher pattern that controls which paths the middleware processes.
 */

// ---------------------------------------------------------------------------
// Mock next-intl/middleware — returns a pass-through that calls next().
// This isolates the www-redirect logic from locale negotiation.
// ---------------------------------------------------------------------------
vi.mock("next-intl/middleware", () => ({
	default: vi.fn(() => (_req: NextRequest) => NextResponse.next()),
}));

// Mock the routing module imported by middleware.ts.
// The middleware uses `import { routing } from "./i18n/routing"`, so we mock
// the same relative path (resolved from src/middleware.ts).
vi.mock("./i18n/routing", () => ({
	routing: {
		locales: ["en", "pt"],
		defaultLocale: "en",
	},
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
	describe("www → non-www redirect", () => {
		it("redirects www.daniel-freire.com to daniel-freire.com", () => {
			const req = buildReq("www.daniel-freire.com", "/en/about");
			const res = middleware(req);

			expect(res).toBeInstanceOf(NextResponse);
			expect(res.status).toBe(308);
			expect(res.headers.get("location")).toBe("https://daniel-freire.com/en/about");
		});

		it("redirects www root to non-www root", () => {
			const req = buildReq("www.daniel-freire.com", "/");
			const res = middleware(req);

			expect(res).toBeInstanceOf(NextResponse);
			expect(res.status).toBe(308);
			expect(res.headers.get("location")).toBe("https://daniel-freire.com/");
		});

		it("preserves query parameters in the redirect", () => {
			const req = buildReq("www.daniel-freire.com", "/en/contact?utm_source=google");
			const res = middleware(req);

			expect(res.status).toBe(308);
			expect(res.headers.get("location")).toBe("https://daniel-freire.com/en/contact?utm_source=google");
		});

		it("does NOT redirect when hostname is already non-www", () => {
			const req = buildReq("daniel-freire.com", "/en/about");
			const res = middleware(req);

			expect(res.status).not.toBe(308);
		});

		it("redirects any www-prefixed hostname", () => {
			const req = buildReq("www.example.com", "/some/path");
			const res = middleware(req);

			expect(res.status).toBe(308);
			expect(res.headers.get("location")).toBe("https://example.com/some/path");
		});

		it("does NOT redirect non-www subdomains like api", () => {
			const req = buildReq("api.daniel-freire.com", "/v1/users");
			const res = middleware(req);

			expect(res.status).not.toBe(308);
		});

		it("preserves pathname and hash in redirect", () => {
			const req = buildReq("www.daniel-freire.com", "/pt/servicos/web-development#pricing");
			const res = middleware(req);

			expect(res.status).toBe(308);
			expect(res.headers.get("location")).toBe("https://daniel-freire.com/pt/servicos/web-development#pricing");
		});
	});
});

// ===========================================================================
// Matcher pattern tests (legacy — kept intact)
// ===========================================================================
describe("middleware matcher", () => {
	const matcherPatterns = [
		"/((?!api|_next/static|_next/image|trpc|_next|_vercel|favicon.ico|.*/opengraph-image|sitemap.xml|.*\\.svg$|.*\\.png$|.*\\.webp$|.*\\.gif$|.*\\.txt$).*)",
	];

	function matchesPattern(path: string): boolean {
		const excludedPrefixes = [
			"/api/",
			"/_next/static/",
			"/_next/image",
			"/trpc/",
			"/_vercel/",
			"/favicon.ico",
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
