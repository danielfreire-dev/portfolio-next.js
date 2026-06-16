import { describe, it, expect, vi } from "vitest";

// Mock next/navigation notFound
vi.mock("next/navigation", () => ({
	notFound: vi.fn(),
}));

import CatchAllPage from "@/app/[locale]/[...rest]/page";

describe("Catch-all page", () => {
	it("should be a valid function component", () => {
		expect(typeof CatchAllPage).toBe("function");
	});

	it("should not throw when rendered (notFound is mocked)", () => {
		// notFound normally throws NEXT_NOT_FOUND in Next.js,
		// but our mock prevents that
		expect(() => CatchAllPage()).not.toThrow();
	});
});
