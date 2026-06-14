/**
 * Metadata E2E tests for the portfolio site.
 *
 * Verifies that the English-language homepage includes the correct
 * HTML `<title>` and `<meta>` tags (description, author, creator).
 *
 * @module metadata.cy
 */

describe("English Metadata", () => {
	cy.visit("http://daniel-freire.com/en");

	it("multi-page testing", () => {
		// Assert the page title includes the expected branding
		cy.title().should("include", "Homepage | Daniel Freire");

		// Assert the meta description matches the expected content
		cy.get('body meta[name="description"]').should(
			"have.attr",
			"content",
			"Daniel's Introduction",
		);
		cy.get('body meta[name="description"]').should(
			"have.attr",
			"content",
			"Daniel's Introduction",
		);

		// Assert the author meta tag
		cy.get('body meta[name="author"]').should(
			"have.attr",
			"content",
			"Daniel Freire",
		);

		// Assert the creator meta tag
		cy.get('body meta[name="creator"]').should(
			"have.attr",
			"content",
			"Daniel Freire",
		);
	});
});
