/**
 * Content E2E tests for the portfolio site.
 *
 * Verifies that key content elements render correctly across pages.
 * These tests validate the presence and correctness of headings,
 * text blocks, images, and other content elements.
 *
 * Requires the dev server to be running (`npm run dev`).
 *
 * @module content.cy
 */

describe("Content verification", () => {
	describe("Home page (English)", () => {
		beforeEach(() => {
			cy.visit("https://daniel-freire.com/en");
		});

		it("should display the site title", () => {
			cy.title().should("include", "Daniel Freire");
		});

		it("should have the sidenav logo visible", () => {
			cy.get("#logo").should("be.visible");
		});

		it("should render the hero section", () => {
			cy.get("h2").should("exist");
		});

		it("should show navigation links in the sidenav", () => {
			cy.get("nav#sidenav").should("be.visible");
			cy.get("nav#sidenav a").should("have.length.at.least", 3);
		});
	});

	describe("About page", () => {
		beforeEach(() => {
			cy.visit("https://daniel-freire.com/en/about");
		});

		it("should load the about page successfully", () => {
			cy.get("h2").should("exist");
		});

		it("should display paragraph content", () => {
			cy.get("p").should("have.length.at.least", 1);
		});
	});

	describe("Portfolio page", () => {
		beforeEach(() => {
			cy.visit("https://daniel-freire.com/en/portfolio");
		});

		it("should load the portfolio page successfully", () => {
			cy.get("h2").should("contain.text", "portfolio");
		});

		it("should display website and project sections", () => {
			cy.contains("Websites").should("exist");
			cy.contains("Projects").should("exist");
		});
	});

	describe("404 page", () => {
		it("should display a custom 404 page for unknown routes", () => {
			cy.visit("https://daniel-freire.com/en/this-page-does-not-exist", {
				failOnStatusCode: false,
			});
			cy.contains("404").should("exist");
		});
	});
});
