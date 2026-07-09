import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useIsActivePath } from "@/ui/hooks/useIsActivePath";

// Shared pathname state for the mock, reset in beforeEach
let mockPathname = "/";

vi.mock("@/i18n/navigation", () => ({
	usePathname: () => mockPathname,
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		back: vi.fn(),
		forward: vi.fn(),
		refresh: vi.fn(),
		prefetch: vi.fn(),
	}),
	Link: "a",
	redirect: vi.fn(),
	getPathname: () => mockPathname,
}));

describe("useIsActivePath", () => {
	beforeEach(() => {
		mockPathname = "/";
	});

	describe("home route", () => {
		it("returns true when current path is '/'", () => {
			mockPathname = "/";
			const { result } = renderHook(() => useIsActivePath());
			expect(result.current("/")).toBe(true);
		});

		it("returns true when current path is '' (empty)", () => {
			mockPathname = "";
			const { result } = renderHook(() => useIsActivePath());
			expect(result.current("/")).toBe(true);
		});

		it("returns false when current path is '/about'", () => {
			mockPathname = "/about";
			const { result } = renderHook(() => useIsActivePath());
			expect(result.current("/")).toBe(false);
		});
	});

	describe("exact path match", () => {
		it("returns true when current path matches target exactly", () => {
			mockPathname = "/about";
			const { result } = renderHook(() => useIsActivePath());
			expect(result.current("/about")).toBe(true);
		});

		it("returns true when current path matches target '/contact'", () => {
			mockPathname = "/contact";
			const { result } = renderHook(() => useIsActivePath());
			expect(result.current("/contact")).toBe(true);
		});

		it("returns false when current path differs from target", () => {
			mockPathname = "/portfolio";
			const { result } = renderHook(() => useIsActivePath());
			expect(result.current("/contact")).toBe(false);
		});

		it("returns false when target path is not a prefix match (contact vs contact-us)", () => {
			mockPathname = "/contact-us";
			const { result } = renderHook(() => useIsActivePath());
			expect(result.current("/contact")).toBe(false);
		});
	});

	describe("child route match", () => {
		it("returns true when current path is a child of target (prefix match)", () => {
			mockPathname = "/services/web-dev";
			const { result } = renderHook(() => useIsActivePath());
			expect(result.current("/services")).toBe(true);
		});

		it("returns true when current path is a nested child", () => {
			mockPathname = "/services/web-dev/details";
			const { result } = renderHook(() => useIsActivePath());
			expect(result.current("/services")).toBe(true);
		});

		it("returns true when current path is /contact/anything", () => {
			mockPathname = "/contact/thank-you";
			const { result } = renderHook(() => useIsActivePath());
			expect(result.current("/contact")).toBe(true);
		});

		it("returns false when current path is parent of target", () => {
			mockPathname = "/services";
			const { result } = renderHook(() => useIsActivePath());
			expect(result.current("/services/web-dev")).toBe(false);
		});
	});

	describe("trailing slash normalization", () => {
		it("matches path with trailing slash against clean target", () => {
			mockPathname = "/about/";
			const { result } = renderHook(() => useIsActivePath());
			expect(result.current("/about")).toBe(true);
		});

		it("matches clean path against target with trailing slash", () => {
			mockPathname = "/about";
			const { result } = renderHook(() => useIsActivePath());
			expect(result.current("/about/")).toBe(true);
		});

		it("matches child path with trailing slash", () => {
			mockPathname = "/services/web-dev/";
			const { result } = renderHook(() => useIsActivePath());
			expect(result.current("/services")).toBe(true);
		});
	});

	describe("double slash normalization", () => {
		it("collapses double slashes in current path", () => {
			mockPathname = "//about";
			const { result } = renderHook(() => useIsActivePath());
			expect(result.current("/about")).toBe(true);
		});

		it("collapses double slashes in child path", () => {
			mockPathname = "/services//web-dev";
			const { result } = renderHook(() => useIsActivePath());
			expect(result.current("/services")).toBe(true);
		});
	});

	describe("encoded characters", () => {
		it("decodes percent-encoded characters in current path", () => {
			mockPathname = "/%63ontact"; // %63 = 'c'
			const { result } = renderHook(() => useIsActivePath());
			expect(result.current("/contact")).toBe(true);
		});
	});

	describe("multiple calls from same hook instance", () => {
		it("supports checking multiple paths from one render", () => {
			mockPathname = "/contact";
			const { result } = renderHook(() => useIsActivePath());
			expect(result.current("/contact")).toBe(true);
			expect(result.current("/about")).toBe(false);
			expect(result.current("/")).toBe(false);
		});
	});
});
