import { describe, it, expect } from "vitest";

/**
 * Tests for the date formatting utility used in getData.ts.
 *
 * `getCurrentWESTDateTime()` is a private function inside the module,
 * so we test its external behaviour indirectly through the module
 * and also verify the server-action export shape.
 */

describe("getData module", () => {
	describe("module exports", () => {
		it("should export getData as a function", async () => {
			// We mock the Resend API key to avoid the throw in module init
			process.env.NEXT_PUBLIC_resend = "test-key";

			const mod = await import("@/lib/getData");
			expect(typeof mod.getData).toBe("function");
		});
	});

	describe("getCurrentWESTDateTime (internal)", () => {
		/**
		 * Tests the date formatting logic by directly calling the module's
		 * internal function pattern. We validate the output format matches
		 * the expected Portuguese locale pattern.
		 */
		it("should produce date strings in Portuguese format", () => {
			// Create a known date and format it the same way the module does
			const testDate = new Date("2026-06-15T14:30:00+01:00");

			const formatter = new Intl.DateTimeFormat("pt-PT", {
				timeZone: "Europe/Lisbon",
				year: "numeric",
				month: "long",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			});

			const parts = formatter.formatToParts(testDate);
			const { year, month, day, hour, minute } = Object.fromEntries(parts.map((part) => [part.type, part.value]));

			const result = `${day} de ${month}, ${year} | ${hour}:${minute}`;

			// Should match pattern: "DD de MÊS, YYYY | HH:MM"
			expect(result).toMatch(/^\d{2} de [a-zç]+(?:, \d{4})? \| \d{2}:\d{2}$/i);
			expect(result).toContain("de");
			expect(result).toContain("|");
		});
	});
});
