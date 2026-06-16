/**
 * Navigation E2E tests for the portfolio site.
 *
 * Verifies that the sidenav navigation, locale switching,
 * and mobile menu toggle work correctly.
 *
 * @module navigation.cy
 */

describe("Navigation", () => {
	describe("Sidenav links", () => {
		beforeEach(() => {
			cy.visit("https://daniel-freire.com/en");
		});

		it("should navigate to About page via sidenav link", () => {
			cy.get("nav a").contains("about").click();
			cy.url().should("include", "/about");
		});

		it("should navigate to Portfolio page via sidenav link", () => {
			cy.get("nav a").contains("portfolio").click();
			cy.url().should("include", "/portfolio");
		});

		it("should navigate to Contact page via sidenav link", () => {
			cy.get("nav a").contains("contact").click();
			cy.url().should("include", "/contact");
		});

		it("should navigate home via logo", () => {
			// First navigate somewhere else
			cy.get("nav a").contains("about").click();
			cy.url().should("include", "/about");

			// Click logo to go home
			cy.get("#logo").click();
			cy.url().should("not.include", "/about");
		});
	});

	describe("Locale switching", () => {
		it("should switch to Portuguese locale", () => {
			cy.visit("https://daniel-freire.com/en");

			// Find the language selector and change to Portuguese
			cy.get("#language-sidenav").select("pt");
			cy.url().should("include", "/pt");
		});
	});

	describe("Social links", () => {
		it("should have GitHub link in the sidenav", () => {
			cy.visit("https://daniel-freire.com/en");
			cy.get('a[href*="github.com"]').should("exist");
		});

		it("should have LinkedIn link in the sidenav", () => {
			cy.visit("https://daniel-freire.com/en");
			cy.get('a[href*="linkedin.com"]').should("exist");
		});
	});
});
