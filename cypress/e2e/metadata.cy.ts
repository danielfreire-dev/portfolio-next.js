/**
 * Metadata E2E tests for the portfolio site.
 *
 * Verifies HTML `<title>` and `<meta>` tags across all supported
 * locales and pages.
 *
 * Requires the dev server to be running.
 *
 * @module metadata.cy
 */

const locales = [
	{ code: "en", label: "English" },
	{ code: "pt", label: "Portuguese" },
	/* DK, PL, DE, CZ can be added as translations complete */
];

describe("Metadata across locales", () => {
	describe("Home page", () => {
		locales.forEach(({ code, label }) => {
			it(`should have correct metadata for ${label} (${code})`, () => {
				cy.visit(`https://daniel-freire.com/${code}`);

				// Title should include the site name
				cy.title().should("include", "Daniel Freire");

				// Should have a meta description
				cy.get('meta[name="description"]').should("exist");
			});
		});

		it("should have Open Graph meta tags", () => {
			cy.visit("https://daniel-freire.com/en");

			cy.get('meta[property="og:title"]').should("exist");
			cy.get('meta[property="og:description"]').should("exist");
			cy.get('meta[property="og:type"]').should("have.attr", "content", "website");
			cy.get('meta[property="og:url"]').should("exist");
		});

		it("should have author and creator meta tags", () => {
			cy.visit("https://daniel-freire.com/en");

			cy.get('meta[name="author"]').should("have.attr", "content", "Daniel Freire");
			cy.get('meta[name="creator"]').should("have.attr", "content", "Daniel Freire");
		});
	});
});
