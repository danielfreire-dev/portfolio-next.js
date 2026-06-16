import { describe, it, expect } from "vitest";
import * as SVGs from "@/ui/Components/svgs";

describe("SVG barrel exports (svgs/index.ts)", () => {
	const expectedExports = [
		"Nextjs",
		"Reactjs",
		"Nodejs",
		"TypeScript",
		"JavaScript",
		"HTML5",
		"CSS3",
		"PostgreSQL",
		"Webpack",
		"Vitejs",
		"Git",
		"Github",
		"Vitest",
		"Jest",
		"Selenium",
		"Python",
		"Linux",
		"Bash",
		"Zsh",
		"GitHubIcon",
		"LinkedInIcon",
		"Sun",
		"Moon",
	];

	describe("export completeness", () => {
		it("should export all expected SVG names", () => {
			for (const name of expectedExports) {
				expect(SVGs).toHaveProperty(name);
			}
		});

		it("should have at least the expected number of exports", () => {
			const actualKeys = Object.keys(SVGs);
			expect(actualKeys.length).toBeGreaterThanOrEqual(expectedExports.length);
		});
	});

	describe("export values", () => {
		it("each export should be truthy (not undefined)", () => {
			for (const name of expectedExports) {
				expect(SVGs[name as keyof typeof SVGs]).toBeTruthy();
			}
		});
	});

	describe("commonly used icons", () => {
		it("GitHubIcon should be defined", () => {
			expect(SVGs.GitHubIcon).toBeDefined();
		});

		it("LinkedInIcon should be defined", () => {
			expect(SVGs.LinkedInIcon).toBeDefined();
		});

		it("Sun and Moon should be defined", () => {
			expect(SVGs.Sun).toBeDefined();
			expect(SVGs.Moon).toBeDefined();
		});
	});
});
