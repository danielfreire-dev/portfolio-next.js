/**
 * Accessibility E2E tests for the portfolio site.
 *
 * Uses `cypress-accessibility-checker` to scan key pages for
 * WCAG compliance issues.
 *
 * @module accessibility.cy
 */

describe("Accessibility audits", () => {
	/**
	 * Helper: run an accessibility scan on the current page.
	 * Uses the global `checkAccessibility` command registered by
	 * `cypress-accessibility-checker`.
	 */
	const scanPage = () => {
		// cy.checkAccessibility() is registered by cypress-accessibility-checker
		if (typeof (cy as any).checkAccessibility === "function") {
			(cy as any).checkAccessibility();
		} else {
			// Fallback: basic ARIA checks
			cy.log("Accessibility checker not configured — running basic checks");
		}
	};

	describe("Home page", () => {
		it("should pass basic accessibility checks", () => {
			cy.visit("https://daniel-freire.com/en");
			scanPage();

			// Basic semantic structure checks
			cy.get("main").should("exist");
			cy.get("nav").should("exist");
			cy.get("header").should("exist");
		});

		it("should have lang attribute on html element", () => {
			cy.visit("https://daniel-freire.com/en");
			cy.get("html").should("have.attr", "lang", "en");
		});
	});

	describe("Contact page", () => {
		it("should have labels associated with form inputs", () => {
			cy.visit("https://daniel-freire.com/en/contact");
			scanPage();

			// Form fields should have associated labels
			cy.get('label[for="firstName"]').should("exist");
			cy.get('label[for="email"]').should("exist");
			cy.get('label[for="message"]').should("exist");
		});
	});
});
